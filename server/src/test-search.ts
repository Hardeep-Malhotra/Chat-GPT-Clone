import { searchWeb } from "./tools/search.tool.js";

const result = await searchWeb("Latest NAVDIA  news");
console.log(JSON.stringify(result, null, 2));
