import { cloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { MeetingModel } from "./meeting.model.js";
import { MeetingRepository } from "./meeting.repository.js";
import { MeetingService } from "./meeting.service.js";
import { MeetingsController } from "./meetings.controller.js";

const TEMPORARY_USER_ID = 1;

const meetingRepository = new MeetingRepository(MeetingModel);
const meetingService: MeetingService = new MeetingService(
	meetingRepository,
	TEMPORARY_USER_ID,
	cloudFormation,
);
const meetingsController = new MeetingsController(logger, meetingRepository);

export { MeetingHost } from "./libs/enums/enums.js";
export { meetingsController, meetingService };
