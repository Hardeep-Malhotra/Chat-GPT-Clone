import "dotenv/config";
import { tavily } from "@tavily/core";

const apiKey = process.env.TAVILY_API_KEY;

if (!apiKey) {
  throw new Error("TAVILY_API_KEY is missing in .env");
}

const client = tavily({ apiKey });

export const searchWeb = async (query: string) => {
  const response = await client.search(query, {
    searchDepth: "basic",
    maxResults: 5,
  });

  return {
    query,
    results: response.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    })),
  };
};