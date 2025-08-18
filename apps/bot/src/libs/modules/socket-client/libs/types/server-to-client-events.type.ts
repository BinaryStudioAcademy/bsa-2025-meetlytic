import { type SocketEvent } from "../enums/enums.js";
import { type MeetingTranscriptionRequestDto } from "./types.js";

type ServerToClientEvents = {
	[SocketEvent.CONNECT]: () => void;
	[SocketEvent.TRANSCRIBE_SAVE_CHUNK]: (
		data: MeetingTranscriptionRequestDto,
	) => void;
};

export { type ServerToClientEvents };
