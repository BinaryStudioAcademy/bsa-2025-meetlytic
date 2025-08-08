import fs from "node:fs";
import OpenAI from "openai";

import { config } from "~/libs/modules/config/config.js";

import { type Logger } from "../logger/logger.js";

class BaseOpenAI {
	private client: OpenAI;
	private logger: Logger;

	public constructor(logger: Logger) {
		this.logger = logger;
		this.client = new OpenAI({ apiKey: config.ENV.OPEN_AI.KEY });
	}

	public async transcribe(
		audioFilePath: string,
		language = "en",
	): Promise<string> {
		try {
			const response = await this.client.audio.transcriptions.create({
				file: fs.createReadStream(audioFilePath),
				language,
				model: config.ENV.OPEN_AI.TRANSCRIPTION_MODEL,
			});

			return response.text;
		} catch (error) {
			this.logger.error("Failed to transcribe an audio");

			throw error;
		}
	}
}

export { BaseOpenAI };
