import { type MeetingTranscriptionResponseDto } from "./types.js";

type CreatePdfOptions = {
	actionItems: string;
	id: number;
	meetingId: string;
	summary: string;
	transcription: MeetingTranscriptionResponseDto[];
};

export { type CreatePdfOptions };
