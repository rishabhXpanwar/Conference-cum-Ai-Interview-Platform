import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

const preferredModels = (
  process.env.GEMINI_MODEL_CANDIDATES ||
  "gemini-2.0-flash,gemini-1.5-pro,gemini-1.5-flash"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

let resolvedModelPromise;

async function resolveWorkingModel() {
  // If explicitly set, trust it
  if (process.env.GEMINI_MODEL) return process.env.GEMINI_MODEL.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`ListModels failed: ${resp.status} ${resp.statusText} - ${txt}`);
  }

  const data = await resp.json();
  const available = (data.models || [])
    .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""));

  const picked =
    preferredModels.find((m) => available.includes(m)) ||
    available[0];

  if (!picked) {
    throw new Error("No generateContent-capable model found for this API key/project.");
  }

  console.log("Gemini model selected:", picked);
  return picked;
}

async function getResolvedModel() {
  if (!resolvedModelPromise) {
    resolvedModelPromise = resolveWorkingModel();
  }
  return resolvedModelPromise;
}

export const generateResumeSummary = async (resumeText) => {
  const modelName = await getResolvedModel();
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
You are an expert resume reviewer.
Summarize this resume in concise bullet points:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};