import { type SocketEvent } from "../enums/enums.js";
import { type MeetingTranscriptionRequestDto } from "./types.js";

type ServerToClientEvents = {
	[SocketEvent.CONNECT]: () => void;
	[SocketEvent.TRANSCRIBE]: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ServerToClientEvents };
