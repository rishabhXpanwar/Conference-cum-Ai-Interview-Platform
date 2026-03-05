import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestion = async ({
    summary,
    phase,
    history,
    allowFollowUp,
}) => {
    const model = genAI.getGenerativeModel({
        model : "gemini-1.5-flash",
    });

    const formattedHistory = history.map((item) => `Q : ${item.question}\nA : ${item.answer}`).join("\n\n");


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

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    // extract type and question from response
    const questionMatch = text.match(/QUESTION:\s*(.*)/);
    const typeMatch = text.match(/TYPE:\s*(MAIN|FOLLOWUP)/);

    return {
        type : typeMatch ? typeMatch[1].toLowerCase() : "main",
        question : questionMatch ? questionMatch[1] : text,
    };
};


export const generateInterviewScore = async ({ summary, questions}) => {
    const model = genAI.getGenerativeModel({
        model : "gemini-1.5-flash",
    });

    const formattedQA = questions.map((item) => `Q : ${item.question}\nA : ${item.answer}`).join("\n\n");

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

const result = await model.generateContent(prompt);
const response = result.response.text();
return response;
};