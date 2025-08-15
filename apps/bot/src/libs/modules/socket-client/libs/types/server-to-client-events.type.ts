import { type MeetingTranscriptionRequestDto } from "~/libs/types/types.js";

type ServerToClientEvents = {
	connect: () => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ServerToClientEvents };
