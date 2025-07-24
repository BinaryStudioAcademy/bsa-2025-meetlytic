import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { CloudFormationEC2 } from "./ec2-cloudformation.module.js";
import templateJSON from "./ec2-instance-template.json" with { type: "json" };
import { AWSRegion } from "./libs/enums/enums.js";

const {
	AWS: { ACCESS_KEY_ID, SECRET_ACCESS_KEY },
} = config.ENV;

const ec2 = new CloudFormationEC2({
	accessKeyId: ACCESS_KEY_ID,
	logger,
	region: AWSRegion.EU_NORTH_1,
	secretAccessKey: SECRET_ACCESS_KEY,
	templateBody: JSON.stringify(templateJSON),
});

export { ec2 };
