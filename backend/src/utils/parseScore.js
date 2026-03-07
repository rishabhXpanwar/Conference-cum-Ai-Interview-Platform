//parse Gemini response for score
export default function parseScore  (text)  {
  const tech = text.match(/TECHNICAL:\s*(\d+)/);
  const comm = text.match(/COMMUNICATION:\s*(\d+)/);
  const overall = text.match(/OVERALL:\s*(\d+)/);
  const feedback = text.match(/FEEDBACK:\s*([\s\S]*)/);

  return {
    technical: tech ? Number(tech[1]) : 0,
    communication: comm ? Number(comm[1]) : 0,
    overall: overall ? Number(overall[1]) : 0,
    feedback: feedback ? feedback[1].trim() : "",
  };
};