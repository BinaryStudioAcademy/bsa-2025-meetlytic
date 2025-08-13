type ClientToServerEvents = {
	transcribe: (data: { chunkText: string; meetingId: number }) => void;
};

export { type ClientToServerEvents };
