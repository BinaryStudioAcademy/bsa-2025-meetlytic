import { MeetingTranscriptionModel } from "./meeting-transcription.model.js";
import { MeetingTranscriptionRepository } from "./meeting-transcription.repository.js";
import { MeetingTranscriptionService } from "./meeting-transcription.service.js";

const meetingTranscriptionRepository = new MeetingTranscriptionRepository(
	MeetingTranscriptionModel,
);
const meetingTranscriptionService = new MeetingTranscriptionService({
	meetingTranscriptionRepository,
});
export { meetingTranscriptionService };
