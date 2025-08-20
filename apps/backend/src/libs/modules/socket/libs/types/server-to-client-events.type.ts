import {
	type MeetingSummaryActionItemsResponseDto,
	type MeetingTranscriptionRequestDto,
} from "./types.js";

type ServerToClientEvents = {
	stopRecording: () => Promise<void>;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
	updateMeetingDetails: (data: MeetingSummaryActionItemsResponseDto) => void;
};

export { type ServerToClientEvents };
