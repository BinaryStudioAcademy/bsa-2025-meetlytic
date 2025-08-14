import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseS3 } from "./base-s3.module.js";

const {
	ACCESS_KEY_ID: accessKeyId,
	BUCKET_NAME: bucketName,
	REGION: region,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const s3Instance = new BaseS3({
	credentials: { accessKeyId, secretAccessKey },
	defaultBucket: bucketName,
	logger,
	region,
});

export { s3Instance };
