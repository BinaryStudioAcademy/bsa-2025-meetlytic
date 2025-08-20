import {
	type MeetingSummaryActionItemsResponseDto,
	type MeetingTranscriptionRequestDto,
} from "~/libs/types/types.js";

type ClientToServerEvents = {
	joinRoom: (meetingId: string) => void;
	recordingStopped: (meetingId: string) => void;
	saveSummaryActionItems: (data: MeetingSummaryActionItemsResponseDto) => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
