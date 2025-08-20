import { type MeetingTranscriptionRequestDto } from "~/libs/types/types.js";

type ServerToClientEvents = {
	connect: () => void;
	generateSummaryActionItems: (transcript: string) => Promise<void>;
	getPublicUrl: (piblicUrl: string) => void;
	stopRecording: () => Promise<void>;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ServerToClientEvents };
