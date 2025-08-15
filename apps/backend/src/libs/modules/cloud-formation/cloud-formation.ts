import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseCloudFormation } from "./base-cloud-formation.module.js";

const {
	ACCESS_KEY_ID: accessKeyId,
	AMI_ID: imageId,
	BUCKET_NAME: bucketName,
	REGION: region,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const { ORIGIN: origin } = config.ENV.APP;

const { NAME: botName } = config.ENV.BOT;

const {
	KEY: openAIKey,
	TEXT_GENERATION_MODEL: textGenerationModel,
	TRANSCRIPTION_MODEL: transcriptionModel,
} = config.ENV.OPEN_AI;

const cloudFormation = new BaseCloudFormation({
	credentials: { accessKeyId, secretAccessKey },
	imageId,
	logger,
	region,
	settings: {
		accessKeyId,
		botName,
		bucketName,
		openAIKey,
		origin,
		region,
		secretAccessKey,
		textGenerationModel,
		transcriptionModel,
	},
});

export { cloudFormation };
export { type CloudFormation, type CreateStack } from "./libs/type/types.js";
