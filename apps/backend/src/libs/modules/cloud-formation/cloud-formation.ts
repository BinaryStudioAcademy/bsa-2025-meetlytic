import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { CloudFormation } from "./cloud-formation.module.js";
import templateJSON from "./libs/templates/ec2-instance-template.json" with { type: "json" };

const {
	ACCESS_KEY_ID: accessKeyId,
	AMI_ID: imageId,
	REGION,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const cloudFormation = new CloudFormation({
	credentials: { accessKeyId, secretAccessKey },
	imageId,
	logger,
	meetingService,
	region: REGION,
	templateBody: JSON.stringify(templateJSON),
});

export { cloudFormation };
