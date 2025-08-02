import fs from "node:fs";
import { type OpenAI } from "openai";

class BaseOpenAI {
	private client: OpenAI;

	public constructor(client: OpenAI) {
		this.client = client;
	}

	public async transcribe(
		audioFilePath: string,
		language = "en",
	): Promise<string> {
		const response = await this.client.audio.transcriptions.create({
			file: fs.createReadStream(audioFilePath),
			language,
			model: "whisper-1",
		});

		return response.text;
	}
}

export { BaseOpenAI };
