import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { BaseCloudFormation } from "./base-cloud-formation.module.js";

const {
	ACCESS_KEY_ID: accessKeyId,
	AMI_ID: imageId,
	REGION,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const cloudFormation = new BaseCloudFormation({
	credentials: { accessKeyId, secretAccessKey },
	imageId,
	logger,
	meetingService,
	region: REGION,
});

export { cloudFormation };
export { type CloudFormation } from "./libs/type/types.js";
