import { type MeetingTranscriptionRequestDto } from "./types.js";

type ServerToClientEvents = {
	connect: () => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ServerToClientEvents };
