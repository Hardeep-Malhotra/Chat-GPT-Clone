
import { z } from "zod";

export const getWeatherSchema = z.object({
  city: z.string().min(2).max(100),
});

export const calculateSchema = z.object({
  expression: z.string().min(1).max(100),
});

export const getCurrentTimeSchema = z.object({
  city: z.string().min(2).max(100),
});

export const searchWebSchema = z.object({
  query: z.string().min(2).max(500),
});
