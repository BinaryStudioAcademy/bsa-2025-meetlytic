import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseCloudFormation } from "./base-cloud-formation.module.js";

const {
	ACCESS_KEY_ID: accessKeyId,
	AMI_ID: imageId,
	REGION: region,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const {
	BUCKET_NAME: bucketName,
	CONTET_TYPE_AUDIO: contentTypeAudio,
	PREFIX_AUDIO: prefixAudio,
} = config.ENV.S3;

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
		contentTypeAudio,
		openAIKey,
		origin,
		prefixAudio,
		region,
		secretAccessKey,
		textGenerationModel,
		transcriptionModel,
	},
});

export { cloudFormation };
export { type CloudFormation, type CreateStack } from "./libs/type/types.js";
