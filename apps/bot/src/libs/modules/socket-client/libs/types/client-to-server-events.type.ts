import {
	type MeetingAudioSaveDto,
	type MeetingTranscriptionRequestDto,
} from "./types.js";

type ClientToServerEvents = {
	"audio:save": (data: MeetingAudioSaveDto) => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
