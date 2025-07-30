import { cloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { MeetingsController } from "./meetings.controller.js";
import { MeetingModel } from "./meetings.model.js";
import { MeetingRepository } from "./meetings.repository.js";
import { MeetingService } from "./meetings.service.js";

const meetingRepository = new MeetingRepository(MeetingModel);
const meetingService: MeetingService = new MeetingService({
	cloudFormation,
	meetingRepository,
});
const meetingsController = new MeetingsController(logger, meetingService);

export { meetingsController };
export { MeetingService } from "./meetings.service.js";
