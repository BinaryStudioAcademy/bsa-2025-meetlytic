import { cloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { MeetingModel } from "./meeting.model.js";
import { MeetingRepository } from "./meeting.repository.js";
import { MeetingService } from "./meeting.service.js";
import { MeetingsController } from "./meetings.controller.js";

const meetingRepository = new MeetingRepository(MeetingModel);
const meetingService = new MeetingService({
	cloudFormation,
	meetingRepository,
});
const meetingsController = new MeetingsController(logger, meetingService);

export { meetingsController };
export { MeetingService } from "./meeting.service.js";
