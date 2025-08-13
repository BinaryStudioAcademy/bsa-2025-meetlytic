type ServerToClientEvents = {
	connect: () => void;
	transcribe: (data: { chunkText: string; zoomMeetingId: number }) => void;
};

export { type ServerToClientEvents };
