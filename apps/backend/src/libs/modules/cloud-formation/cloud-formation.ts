import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseCloudFormation } from "./base-cloud-formation.module.js";

const {
	ACCESS_KEY_ID: accessKeyId,
	AMI_ID: imageId,
	REGION,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const { NAME: botName } = config.ENV.BOT;

const {
	KEY: openAIKey,
	TEXT_GENERATION_MODEL: textGenerationModel,
	TRANSCRIPTION_MODEL: transcriptionModel,
} = config.ENV.OPEN_AI;

const cloudFormation = new BaseCloudFormation({
	botName,
	credentials: { accessKeyId, secretAccessKey },
	imageId,
	logger,
	openAIKey,
	region: REGION,
	textGenerationModel,
	transcriptionModel,
});

export { cloudFormation };
export { type CloudFormation } from "./libs/type/types.js";
