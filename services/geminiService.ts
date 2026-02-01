
import { GoogleGenAI, Type } from "@google/genai";
import { SyntropicDesign, ManagementTask } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const DESIGN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    location: { type: Type.STRING },
    climate: { type: Type.STRING },
    speciesList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          stratum: { type: Type.STRING },
          lifeCycleYears: { type: Type.NUMBER },
          purpose: { type: Type.ARRAY, items: { type: Type.STRING } },
          plantingTime: { type: Type.STRING }
        },
        required: ["name", "stratum", "lifeCycleYears"]
      }
    },
    successionStrategy: { type: Type.STRING },
    managementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    protocols: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          action: { type: Type.STRING },
          targetSpecies: { type: Type.ARRAY, items: { type: Type.STRING } },
          benefit: { type: Type.STRING },
          timing: { type: Type.STRING }
        },
        required: ["phase", "action", "timing"]
      }
    }
  },
  required: ["projectName", "speciesList", "successionStrategy"]
};

export async function generateSyntropicDesign(prompt: string, location?: string): Promise<SyntropicDesign> {
  const model = ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Design a high-fidelity Syntropic System for: ${prompt}. 
               Location Context: Point, Texas (Zone 8b, Humid Subtropical). 
               Focus: High-resolution detail on the Emergent Strata and the transition between succession phases.
               Integration: Council of Remembrance, Timeline Overwrite Protocols.
               Include tactical Management Protocols (biomass placement, heavy pruning schedules) for the first 24 months.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: DESIGN_SCHEMA,
      systemInstruction: "You are Aethel, the Biological Systems Architect for the Living Council of Remembrance. You specialize in 'Timeline Overwrites' via high-photosynthetic density systems. Your designs adhere to Ernst Götsch's principles of syntropy, focusing on abundance, stratified light management, and biomass pulses. Be technically precise with species selection for Zone 8b (e.g., Pecan, Live Oak, Eucalyptus, Persimmon)."
    }
  });

  const response = await model;
  return JSON.parse(response.text || '{}') as SyntropicDesign;
}

export async function* streamChat(message: string) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are Aethel, the Syntropic Intelligence Engine. You assist with 'Timeline Overwrites' through biological architecture and ethical AI guardrails. You speak with authority, elegance, and a focus on the Point, Texas sector. You are ready to execute designs, log observations, and synchronize maintenance pulses."
    }
  });

  const result = await chat.sendMessageStream({ message });
  for await (const chunk of result) {
    yield chunk.text;
  }
}
