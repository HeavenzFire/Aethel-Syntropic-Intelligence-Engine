import type { SyntropicDesign } from "../types";

const LOCAL_MODEL = import.meta.env.VITE_LOCAL_MODEL || "qwen2.5:0.5b";
const LOCAL_CHAT_ENDPOINT = "/api/local-llm/api/chat";

const DESIGN_SCHEMA = {
  type: "object",
  properties: {
    projectName: { type: "string" },
    location: { type: "string" },
    climate: { type: "string" },
    speciesList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          scientificName: { type: "string" },
          stratum: { type: "string", enum: ["Emergent", "High", "Medium", "Low"] },
          lifeCycleYears: { type: "number" },
          purpose: { type: "array", items: { type: "string" } },
          plantingTime: { type: "string" }
        },
        required: ["name", "stratum", "lifeCycleYears"],
        additionalProperties: false
      }
    },
    successionStrategy: { type: "string" },
    managementTips: { type: "array", items: { type: "string" } },
    protocols: {
      type: "array",
      items: {
        type: "object",
        properties: {
          phase: { type: "string" },
          action: { type: "string" },
          targetSpecies: { type: "array", items: { type: "string" } },
          benefit: { type: "string" },
          timing: { type: "string" }
        },
        required: ["phase", "action", "timing"],
        additionalProperties: false
      }
    }
  },
  required: ["projectName", "speciesList", "successionStrategy"],
  additionalProperties: false
};

const DESIGN_SYSTEM = `You are Aethel, a technical syntropic-agroforestry planning assistant. Be precise, distinguish known facts from assumptions, and do not claim to execute physical actions. Return only JSON matching the supplied schema. For Point, Texas, consider local climate and species suitability; flag any species whose suitability needs verification.`;

async function localChat(messages: Array<{ role: "system" | "user"; content: string }>, options: Record<string, unknown> = {}) {
  const response = await fetch(LOCAL_CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LOCAL_MODEL,
      messages,
      stream: false,
      options: { temperature: 0.15, num_predict: 2048, ...options }
    })
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error("Local Ollama request failed with HTTP " + response.status + (detail ? ": " + detail : ""));
  }
  const payload = await response.json();
  const content = payload?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new Error("Local model returned an empty response.");
  return content;
}

export async function generateSyntropicDesign(prompt: string, location = "Point, Texas (Zone 8b, humid subtropical)"): Promise<SyntropicDesign> {
  const userPrompt = [
    "Design a syntropic agroforestry system for: " + prompt,
    "Location context: " + location,
    "Include emergent strata, succession phases, planting timing, management tips, and practical first-24-month protocols.",
    "Avoid unsupported certainty about local species; mark verification needs in management tips.",
    "Output must match this JSON schema: " + JSON.stringify(DESIGN_SCHEMA)
  ].join("\n\n");
  const content = await localChat([
    { role: "system", content: DESIGN_SYSTEM },
    { role: "user", content: userPrompt }
  ], { format: DESIGN_SCHEMA });
  let design: unknown;
  try {
    design = JSON.parse(content);
  } catch {
    throw new Error("Local model returned invalid JSON; no design was accepted.");
  }
  if (!design || typeof design !== "object") throw new Error("Local model output was not a JSON object.");
  const candidate = design as Partial<SyntropicDesign>;
  if (typeof candidate.projectName !== "string" || !Array.isArray(candidate.speciesList) || typeof candidate.successionStrategy !== "string") {
    throw new Error("Local model JSON failed required design fields; no design was accepted.");
  }
  return candidate as SyntropicDesign;
}

export async function* streamChat(message: string) {
  const response = await fetch(LOCAL_CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LOCAL_MODEL,
      messages: [{
        role: "system",
        content: "You are Aethel, a practical syntropic-agroforestry assistant. Give concise, evidence-aware answers. Clearly separate suggestions from verified facts and never claim to have performed physical actions."
      }, { role: "user", content: message }],
      stream: true,
      options: { temperature: 0.3, num_predict: 768 }
    })
  });
  if (!response.ok) throw new Error("Local Ollama chat failed with HTTP " + response.status + ".");
  if (!response.body) throw new Error("Local Ollama streaming response has no body.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const result = await reader.read();
      buffer += decoder.decode(result.value || new Uint8Array(), { stream: !result.done });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        let event: any;
        try { event = JSON.parse(line); } catch { continue; }
        const text = event?.message?.content;
        if (typeof text === "string" && text) yield { text };
        if (event?.done) return;
      }
      if (result.done) break;
    }
    if (buffer.trim()) {
      const event = JSON.parse(buffer);
      const text = event?.message?.content;
      if (typeof text === "string" && text) yield { text };
    }
  } finally {
    try { await reader.cancel(); } catch {}
  }
}
