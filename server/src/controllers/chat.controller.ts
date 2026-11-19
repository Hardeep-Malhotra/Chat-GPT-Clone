import type { Request, Response } from "express";
import { generateAIResponse } from "../services/gemini.service.js";

export const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message",
      });
    }

    const aiResponse = await generateAIResponse(message);

    return res.status(200).json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};
