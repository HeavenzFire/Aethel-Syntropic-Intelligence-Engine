<div align="center">
<img width="1200" height="475" alt="Aethel Syntropic Intelligence Engine" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Aethel Syntropic Intelligence Engine

A local-first syntropic agroforestry planning UI. Model inference runs through a local Ollama server; this app does not require a Gemini API key and does not send prompts to a hosted model provider.

## Run locally

**Prerequisites:** Node.js and [Ollama](https://ollama.com/) installed on the same computer.

1. Install the dependencies:

   ```powershell
   npm install
   ```

2. Pull a local model with an appropriate license and enough capability for your workload. The default is `qwen2.5:0.5b`; change `VITE_LOCAL_MODEL` in your local `.env.local` if you choose another Ollama-compatible model.

   ```powershell
   ollama pull qwen2.5:0.5b
   ```

3. Optional local configuration in `.env.local`:

   ```text
   LOCAL_LLM_BASE_URL=http://127.0.0.1:11434
   VITE_LOCAL_MODEL=qwen2.5:0.5b
   ```

4. Start the app:

   ```powershell
   npm run dev
   ```

The Vite server binds to loopback only and proxies `/api/local-llm` to the local Ollama endpoint. No provider key is embedded into browser JavaScript.

## Important limits

- This replaces the Gemini API dependency with local inference; it does not guarantee output quality parity with Gemini 3 Pro/Flash.
- Structured design output is parsed and checked for required fields. Invalid JSON or missing required fields is rejected rather than accepted as a design.
- Model output is advisory. Verify species suitability, climate assumptions, and planting guidance with reliable local sources before acting.
- Browser UI usage requires the local Vite server and local Ollama service. It is not a hosted multi-user deployment.
- Do not expose the Vite server or Ollama endpoint to the public internet.
