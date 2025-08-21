import { type MeetingTranscriptionResponseDto } from "./types.js";

type CreatePdfOptions = {
	actionItems: string;
	id: number;
	summary: string;
	transcription: MeetingTranscriptionResponseDto[];
};

export { type CreatePdfOptions };
