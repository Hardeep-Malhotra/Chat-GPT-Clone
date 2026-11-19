import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// 1. API key environment se read karo
const apiKey = process.env.GEMINI_API_KEY;

// 2. API key missing ho toh server ko error do
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

// 3. Gemini client initialize karo
const ai = new GoogleGenAI({ apiKey });

// 4. Reusable function to generate AI response
export const generateAIResponse = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
  });

  const answer = response.text;

  if (!answer) {
    throw new Error("Gemini returned an empty response");
  }

  return answer;
};
