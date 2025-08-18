import { type SocketEvent } from "../enums/enums.js";
import {
	type MeetingAudioSaveDto,
	type MeetingTranscriptionRequestDto,
} from "./types.js";

type ClientToServerEvents = {
	[SocketEvent.AUDIO_SAVE]: (data: MeetingAudioSaveDto) => void;
	[SocketEvent.TRANSCRIBE]: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
