type ServerToClientEvents = {
	connect: () => void;
	transcription: (data: { chunkText: string; zoomMeetingId: number }) => void;
};

export { type ServerToClientEvents };
