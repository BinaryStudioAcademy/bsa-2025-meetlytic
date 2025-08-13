type ServerToClientEvents = {
	connect: () => void;
	transcribe: (data: { chunkText: string; meetingId: number }) => void;
};

export { type ServerToClientEvents };
