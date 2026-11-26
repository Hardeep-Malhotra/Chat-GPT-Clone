import {
  getWeatherSchema,
  calculateSchema,
  getCurrentTimeSchema,
  searchWebSchema,
} from "../schemas/tool.schema.js";

import { getWeather } from "../tools/weather.tool.js";
import { calculate } from "../tools/calculator.tool.js";
import { getCurrentTime } from "../tools/time.tool.js";
import { searchWeb } from "../tools/search.tool.js";

export const executeTool = async (
  toolName: string,
  args: unknown,
): Promise<unknown> => {
  switch (toolName) {
    case "getWeather": {
      const validated = getWeatherSchema.parse(args);
      return await getWeather(validated.city);
    }

    case "calculate": {
      const validated = calculateSchema.parse(args);
      return await calculate(validated.expression);
    }

    case "getCurrentTime": {
      const validated = getCurrentTimeSchema.parse(args);
      return await getCurrentTime(validated.city);
    }

    case "searchWeb": {
      const validated = searchWebSchema.parse(args);
      return await searchWeb(validated.query);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
};
