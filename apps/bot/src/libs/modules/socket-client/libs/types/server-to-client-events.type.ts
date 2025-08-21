import { type MeetingTranscriptionRequestDto } from "./types.js";

type ServerToClientEvents = {
	connect: () => void;
	generateSummaryActionItems: (transcript: string) => Promise<void>;
	stopRecording: () => Promise<void>;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ServerToClientEvents };
