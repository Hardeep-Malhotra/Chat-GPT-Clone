import { Type, type FunctionDeclaration } from "@google/genai";
import { describe } from "node:test";

export const toolDefinitions: FunctionDeclaration[] = [
  {
    name: "getWeather",
    description: "Get weather information for a given city",
    parameters: {
      type: Type.OBJECT,
      properties: {
        city: {
          type: Type.STRING,
          description: "Name of the city",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "calculate",
    description: "Calculate a mathematical expression",
    parameters: {
      type: Type.OBJECT,
      properties: {
        expression: {
          type: Type.STRING,
          description: "Math expression such as 10 + 20",
        },
      },
      required: ["expression"],
    },
  },
  {
    name: "getCurrentTime",
    description: "Get the current local time of a city",
    parameters: {
      type: Type.OBJECT,
      properties: {
        city: {
          type: Type.STRING,
          description: "Name of the city",
        },
      },
      required: ["city"],
    },
  },

  {
    name: "searchWeb",
    description:
      "Search the internet for information about any topic and return relevant web results",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "The topic or question to search for on the internet",
        },
      },
      required: ["query"],
    },
  },
];
