import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_RESUME_CHARS = Number(process.env.GEMINI_MAX_RESUME_CHARS || 12000);

// Circuit breaker to avoid hammering Gemini when quota is exhausted.
let skipAiUntil = 0;

function extractRetryDelayMs(message = "") {
  const match = message.match(/retry in\s*([\d.]+)s/i);
  if (!match) return 60000;
  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds) || seconds <= 0) return 60000;
  return Math.ceil(seconds * 1000);
}

function isQuotaError(message = "") {
  return (
    message.includes("429") ||
    message.toLowerCase().includes("quota exceeded") ||
    message.toLowerCase().includes("too many requests")
  );
}

export const generateResumeSummary = async (resumeText) => {
  if (Date.now() < skipAiUntil) {
  throw new Error("AI_BUSY");
}

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const safeText = String(resumeText || "").slice(0, MAX_RESUME_CHARS);

  const prompt = `
You are an expert resume reviewer.
Summarize this resume in concise bullet points:
${safeText}
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    const msg = err?.message || "";

    if (isQuotaError(msg)) {
      const delayMs = extractRetryDelayMs(msg);
      skipAiUntil = Date.now() + delayMs;
      console.warn(
        `Gemini quota/rate limit reached. Skipping AI calls for ${Math.ceil(delayMs / 1000)}s.`
      );
      throw new Error("AI_BUSY");
    }

    throw err;
  }
};