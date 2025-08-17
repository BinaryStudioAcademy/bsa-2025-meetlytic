import {
	DeleteObjectCommand,
	type DeleteObjectCommandInput,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";

import { FILENAME_SANITIZE_REGEX } from "~/libs/constants/constants.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { S3ErrorMessage } from "./libs/enums/enum.js";

type Constructor = {
	bucketName?: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
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
	private bucketName?: string;
	private client: S3Client;
	private logger: Logger;

	public constructor({ bucketName, credentials, logger, region }: Constructor) {
		this.logger = logger;

		if (bucketName) {
			this.bucketName = bucketName;
		}

		this.client = new S3Client({ credentials, region });
	}

	public buildKey(
		folderPrefix: string,
		originalFileName: string,
		userId?: number,
	): string {
		const safeFileName = originalFileName.replace(FILENAME_SANITIZE_REGEX, "_");
		const timestamp = Date.now();
		const prefix = userId ? `${folderPrefix}/${String(userId)}` : folderPrefix;

		return `${prefix}/${String(timestamp)}_${safeFileName}`;
	}

	public async deleteObject({ bucket, key }: DeleteOptions): Promise<void> {
		const bucketName = bucket ?? this.bucketName;

		if (!bucketName) {
			throw new Error(S3ErrorMessage.MISSING_BUCKET);
		}

		const input: DeleteObjectCommandInput = {
			Bucket: bucketName,
			Key: key,
		};

		await this.client.send(new DeleteObjectCommand(input));
		this.logger.info(`[S3] Deleted s3://${bucketName}/${key}`);
	}

	public getClient(): S3Client {
		return this.client;
	}

	public getPublicUrl(key: string, bucket?: string): string {
		const bucketName = bucket ?? this.bucketName;

		if (!bucketName) {
			throw new Error(S3ErrorMessage.MISSING_BUCKET);
		}

		return `https://${bucketName}.s3.amazonaws.com/${key}`;
	}

	public async uploadObject({
		body,
		bucket,
		contentType,
		key,
		metadata,
	}: UploadOptions): Promise<{ key: string; url: string }> {
		const bucketName = bucket ?? this.bucketName;

		if (!bucketName) {
			throw new Error(S3ErrorMessage.MISSING_BUCKET);
		}

		const input: PutObjectCommandInput = {
			Body: body,
			Bucket: bucketName,
			ContentType: contentType,
			Key: key,
			...(metadata ? { Metadata: metadata } : {}),
		};

		await this.client.send(new PutObjectCommand(input));

		const url = this.getPublicUrl(key, bucketName);
		this.logger.info(`[S3] Uploaded -> ${url}`);

		return { key, url };
	}
}

export { BaseS3 };
