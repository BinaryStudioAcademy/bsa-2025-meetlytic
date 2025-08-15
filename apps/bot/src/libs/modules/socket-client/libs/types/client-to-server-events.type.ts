import {
	type MeetingAudioRequestDto,
	type MeetingTranscriptionRequestDto,
} from "~/libs/types/types.js";

type ClientToServerEvents = {
	"audio:save": (data: MeetingAudioRequestDto) => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
