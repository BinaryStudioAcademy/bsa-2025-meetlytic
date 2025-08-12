import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { BaseS3 } from "./base-s3.module.js";

const {
	ACCESS_KEY_ID: accessKeyId,
	REGION: region,
	SECRET_ACCESS_KEY: secretAccessKey,
} = config.ENV.AWS;

const { BUCKET_NAME: bucketName } = config.ENV.S3;

const s3 = new BaseS3({
	bucketName,
	credentials: { accessKeyId, secretAccessKey },
	logger,
	region,
});

export { s3 };
export { type S3 } from "./libs/types/types.js";
