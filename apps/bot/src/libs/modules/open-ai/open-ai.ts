import OpenAI from "openai";

import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseOpenAI } from "./base-open-ai.module.js";

const client = new OpenAI({ apiKey: config.ENV.OPEN_AI.OPEN_AI_KEY });
const openAI = new BaseOpenAI(client, logger);

export { openAI };
