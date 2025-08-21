import { type MeetingTranscriptionResponseDto } from "./types.js";

type CreatePdfOptions = {
	actionItems: string;
	meetingId: string;
	summary: string;
	transcription: MeetingTranscriptionResponseDto[];
};

export { type CreatePdfOptions };
