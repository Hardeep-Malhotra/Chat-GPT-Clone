
import "dotenv/config";
import { GoogleGenAI, type Content } from "@google/genai";

import { toolDefinitions } from "../tools/tool-definitions.js";
import { executeTool } from "../utils/tool-executor.js";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const ai = new GoogleGenAI({ apiKey });

const MODEL = "gemini-3.5-flash-lite";
const MAX_RETRIES = 2;
const MAX_TOOL_ROUNDS = 5;

// Gemini API call with 503 retry handling
const generateWithRetry = async (contents: Content[]) => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          tools: [{ functionDeclarations: toolDefinitions }],
        },
      });
    } catch (error: unknown) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? error.status
          : undefined;

      if (status !== 503 || attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Gemini request failed after retries");
};

// Main AI response function with automatic tool calling
export const generateAIResponse = async (
  prompt: string
): Promise<string> => {
  const contents: Content[] = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await generateWithRetry(contents);

    const functionCalls = response.functionCalls;

    // No tool requested: return Gemini's final answer
    if (!functionCalls || functionCalls.length === 0) {
      const answer = response.text;

      if (!answer) {
        throw new Error("Gemini returned an empty response");
      }

      return answer;
    }

    // Preserve Gemini's function-call message in conversation history
    const modelContent = response.candidates?.[0]?.content;

    if (!modelContent) {
      throw new Error("Gemini returned an invalid function call");
    }

    contents.push(modelContent);

    // Execute all requested tools
    const functionResponses = await Promise.all(
      functionCalls.map(async (call) => {
        if (!call.name) {
          return {
            functionResponse: {
              name: "unknown",
              response: { error: "Function name is missing" },
            },
          };
        }

        try {
          const result = await executeTool(
            call.name,
            call.args ?? {}
          );

          return {
            functionResponse: {
              name: call.name,
              response: { result },
            },
          };
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : "Tool execution failed";

          return {
            functionResponse: {
              name: call.name,
              response: { error: message },
            },
          };
        }
      })
    );

    // Send tool results back to Gemini
    contents.push({
      role: "user",
      parts: functionResponses,
    });
  }

  throw new Error("Maximum tool calling rounds exceeded");
};
