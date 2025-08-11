type OpenAI = {
	transcribe: (audioFilePath: string, language?: string) => Promise<string>;
};

export { type OpenAI };
