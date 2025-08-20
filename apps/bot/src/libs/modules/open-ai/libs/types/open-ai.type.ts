type OpenAI = {
	createActionItems: (prompt: string) => Promise<string>;
	summarize: (prompt: string) => Promise<string>;
	transcribe: (audioFilePath: string, language?: string) => Promise<string>;
};

export { type OpenAI };
