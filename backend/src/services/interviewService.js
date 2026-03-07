import { GEMINI_API_KEY } from "../config/env.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

const apiKey = GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

console.log("GEMINI KEY:", apiKey);

export const generateInterviewQuestion = async ({
  summary,
  phase,
  history,
  allowFollowUp,
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const formattedHistory = history
    .map((item) => `Q : ${item.question}\nA : ${item.answer}`)
    .join("\n\n");

  const prompt = `
You are conducting a structured interview.

Candidate Summary:
${summary}

Current Phase: ${phase}

Recent Conversation:
${formattedHistory}

Rules:
- Ask only ONE question.
- Follow-up allowed: ${allowFollowUp}
- If follow-up allowed and clarification needed, ask FOLLOWUP.
- Otherwise ask MAIN.
- Total main questions max: 10
- Max followups per main: 2

Respond strictly in this format:

TYPE: MAIN or FOLLOWUP
QUESTION: <your question>
`;

  let text;

try {

  if (Date.now() < skipAiUntil) {
    throw new Error("AI_BUSY");
  }

  const result = await model.generateContent(prompt);

  text = result.response.text();

} catch (err) {

  const msg = err?.message || "";

  if (isQuotaError(msg)) {

    const delay = extractRetryDelayMs(msg);

    skipAiUntil = Date.now() + delay;

    console.warn(`Gemini quota hit. Skipping AI calls for ${delay / 1000}s`);

    throw new Error("AI_BUSY");
  }

  throw err;
}

  // extract type and question from response
  const questionMatch = text.match(/QUESTION:\s*(.*)/);
  const typeMatch = text.match(/TYPE:\s*(MAIN|FOLLOWUP)/);

  return {
    type: typeMatch ? typeMatch[1].toLowerCase() : "main",
    question: questionMatch ? questionMatch[1] : text,
  };
};

export const generateInterviewScore = async ({ summary, questions }) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const formattedQA = questions
    .map((item) => `Q : ${item.question}\nA : ${item.answer}`)
    .join("\n\n");

  const prompt = `
    You are an expert interviewer.
You are evaluating a candidate's interview.

Candidate Summary:
${summary}

Interview Transcript:
${formattedQA}

Give response strictly in this format:

TECHNICAL: <number out of 10>
COMMUNICATION: <number out of 10>
OVERALL: <number out of 10>
FEEDBACK: <short paragraph>
`;

  let response;

try {

  if (Date.now() < skipAiUntil) {
    throw new Error("AI_BUSY");
  }

  const result = await model.generateContent(prompt);

  response = result.response.text();

} catch (err) {

  const msg = err?.message || "";

  if (isQuotaError(msg)) {

    const delay = extractRetryDelayMs(msg);

    skipAiUntil = Date.now() + delay;

    console.warn(`Gemini quota hit. Skipping AI calls for ${delay / 1000}s`);

    throw new Error("AI_BUSY");
  }

  throw err;
}
  return response;
};
