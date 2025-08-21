import {
	type MeetingAudioSaveDto,
	type MeetingSummaryActionItemsResponseDto,
	type MeetingTranscriptionRequestDto,
} from "~/libs/types/types.js";

type ClientToServerEvents = {
	getPublicUrl: (meetingId: string) => void;
	audioSave: (data: MeetingAudioSaveDto) => void;
	joinRoom: (meetingId: string) => void;
	recordingStopped: (meetingId: string) => void;
	saveSummaryActionItems: (data: MeetingSummaryActionItemsResponseDto) => void;
	transcribe: (data: MeetingTranscriptionRequestDto) => void;
};

export { type ClientToServerEvents };
