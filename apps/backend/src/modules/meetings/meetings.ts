import { logger } from "~/libs/modules/logger/logger.js";

import { MeetingModel } from "./meeting.model.js";
import { MeetingRepository } from "./meeting.repository.js";
import { MeetingsController } from "./meetings.controller.js";

const meetingRepository = new MeetingRepository(MeetingModel);
const meetingsController = new MeetingsController(logger, meetingRepository);

export { MeetingHost } from "./libs/enums/enums.js";
export { meetingsController };
