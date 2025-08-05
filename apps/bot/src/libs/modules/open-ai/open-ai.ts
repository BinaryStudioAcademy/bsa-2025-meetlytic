import { logger } from "~/libs/modules/logger/logger.js";

import { BaseOpenAI } from "./base-open-ai.module.js";

const openAI = new BaseOpenAI(logger);

export { openAI };
export { type OpenAI } from "./libs/types/types.js";
