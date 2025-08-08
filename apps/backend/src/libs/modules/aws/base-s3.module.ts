import { S3Client } from "@aws-sdk/client-s3";

import { type Logger } from "~/libs/modules/logger/logger.js";

type Constructor = {
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	logger: Logger;
	region: string;
};

class BaseS3 {
	private client: S3Client;
	private logger: Logger;

	public constructor({ credentials, logger, region }: Constructor) {
		this.logger = logger;
		this.client = new S3Client({ credentials, region });
	}

	public getClient(): S3Client {
		return this.client;
	}
}

export { BaseS3 };
