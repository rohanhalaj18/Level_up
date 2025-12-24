
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client using the mandatory direct environment variable access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInterviewBrief = async (candidateName: string, role: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a concise 2-sentence interview brief for an HR recruiter about to interview ${candidateName} for the ${role} position. Focus on enthusiasm and specific key areas to probe.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ready to discuss candidate experience and cultural fit.";
  }
};

export const generateMeetingAgenda = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a bulleted 3-point agenda for a meeting titled: "${topic}". Make it professional and recruitment-focused.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "• Introduction\n• Role discussion\n• Next steps";
  }
};
