import type { Request, Response } from "express";

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "AI Chatbot Backend is healthy",
  });
};