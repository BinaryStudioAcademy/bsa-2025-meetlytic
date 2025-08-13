type ServerToClientEvents = {
	connect: () => void;
	transcription: (data: { chunkText: string; zoomMeetingId: string }) => void;
};

export { type ServerToClientEvents };
