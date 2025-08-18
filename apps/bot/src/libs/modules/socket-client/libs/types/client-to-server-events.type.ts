import {
	type MeetingSummaryActionPointsResponseDto,
	type MeetingTranscriptionRequestDto,
} from "~/libs/types/types.js";

type ClientToServerEvents = {
	joinRoom: (meetingId: string) => void;
	saveSummaryActionItems: (data: MeetingSummaryActionPointsResponseDto) => void;
	stopRecording: (meetingId: string) => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
