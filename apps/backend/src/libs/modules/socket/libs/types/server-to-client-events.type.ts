import { type MeetingTranscriptionRequestDto } from "./types.js";

type ServerToClientEvents = {
	stopRecording: () => Promise<void>;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
	updateMeetingDetails: () => void;
};

export { type ServerToClientEvents };
