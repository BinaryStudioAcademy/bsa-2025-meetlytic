import { type MeetingTranscriptionRequestDto } from "~/libs/types/types.js";

type ClientToServerEvents = {
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
