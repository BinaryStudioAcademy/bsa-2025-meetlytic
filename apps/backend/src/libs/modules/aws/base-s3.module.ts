import {
	DeleteObjectCommand,
	type DeleteObjectCommandInput,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";

import { type Logger } from "~/libs/modules/logger/logger.js";

type Constructor = {
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	defaultBucket?: string;
	logger: Logger;
	region: string;
};

type DeleteOptions = {
	bucket?: string;
	key: string;
};

type UploadOptions = {
	body: NonNullable<PutObjectCommandInput["Body"]>;
	bucket?: string;
	contentType: string;
	key: string;
	metadata?: Record<string, string>;
};

class BaseS3 {
	private client: S3Client;
	private defaultBucket?: string;
	private logger: Logger;

	public constructor({
		credentials,
		defaultBucket,
		logger,
		region,
	}: Constructor) {
		this.logger = logger;

		if (defaultBucket !== undefined) {
			this.defaultBucket = defaultBucket;
		}

		this.client = new S3Client({ credentials, region });
	}

	public async deleteObject({ bucket, key }: DeleteOptions): Promise<void> {
		const Bucket = bucket ?? this.defaultBucket;

		if (!Bucket) {
			throw new Error("Bucket name is required to delete object.");
		}

		const input: DeleteObjectCommandInput = {
			Bucket,
			Key: key,
		};

		this.logger.info(`[S3] Delete start -> ${Bucket}/${key}`);
		await this.client.send(new DeleteObjectCommand(input));
		this.logger.info("[S3] Delete done");
	}

	public getClient(): S3Client {
		return this.client;
	}

	public getPublicUrl(key: string, bucket?: string): string {
		const b = bucket ?? this.defaultBucket;

		if (!b) {
			throw new Error("Bucket name is required to build public URL.");
		}

		return `https://${b}.s3.amazonaws.com/${key}`;
	}

	public async uploadObject({
		body,
		bucket,
		contentType,
		key,
		metadata,
	}: UploadOptions): Promise<{ key: string; url: string }> {
		const Bucket = bucket ?? this.defaultBucket;

		if (!Bucket) {
			throw new Error("Bucket name is required to upload object.");
		}

		const input: PutObjectCommandInput = {
			Body: body,
			Bucket,
			ContentType: contentType,
			Key: key,
			...(metadata ? { Metadata: metadata } : {}),
		};

		this.logger.info(`[S3] Upload start -> ${Bucket}/${key}`);
		await this.client.send(new PutObjectCommand(input));

		const url = this.getPublicUrl(key, Bucket);
		this.logger.info(`[S3] Upload done -> ${url}`);

		return { key, url };
	}
}

export { BaseS3 };
