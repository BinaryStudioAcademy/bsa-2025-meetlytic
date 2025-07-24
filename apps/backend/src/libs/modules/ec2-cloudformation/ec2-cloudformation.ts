import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { CloudFormationEC2 } from "./ec2-cloudformation.module.js";
import templateJSON from "./libs/templates/ec2-instance-template.json" with { type: "json" };

const {
	ACCESS_KEY_ID: accessKeyId,
	REGION,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const ec2 = new CloudFormationEC2({
	credentials: { accessKeyId, secretAccessKey },
	logger,
	region: REGION,
	templateBody: JSON.stringify(templateJSON),
});

export { ec2 };
