type AudioRecorder = {
	onChunk(callback: (chunkFilePath: string) => Promise<void> | void): void;
	start: () => void;
	stop: () => void;
};

export { type AudioRecorder };
