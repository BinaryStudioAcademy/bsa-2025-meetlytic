import { MeetingAudioModel } from "./meeting-audio.model.js";
import { MeetingAudioRepository } from "./meeting-audio.repository.js";
import { MeetingAudioService } from "./meeting-audio.service.js";

const meetingAudioRepository = new MeetingAudioRepository(MeetingAudioModel);
const meetingAudioService = new MeetingAudioService({
	meetingAudioRepository,
});
export { meetingAudioService };
