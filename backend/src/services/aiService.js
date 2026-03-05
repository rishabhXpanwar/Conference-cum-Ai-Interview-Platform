import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const generateResumeSummary = async (resumeText) => {


    const model = genai.getGenerativeModel({
        model : "gemini-1.5-flash",
    });

    const ptompt = `
    You are an expert recruiter.

  Summarize this resume into:
  - 6 to 8 concise bullet points
  - Focus on skills, technologies, experience
  - Keep it short and structured

  Resume : 
  ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
};