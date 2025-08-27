import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

import { FILENAME_SANITIZE_REGEX } from "~/libs/constants/constants.js";
import { S3ErrorMessage } from "~/libs/enums/enums.js";
import { S3Error } from "~/libs/exceptions/exceptions.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type DeleteOptions, type UploadOptions } from "./libs/types/types.js";

type Constructor = {
	bucketName?: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	logger: Logger;
	region: string;
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
			throw new S3Error({
				message: S3ErrorMessage.MISSING_BUCKET,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		await this.client.send(
			new DeleteObjectCommand({
				Bucket: bucketName,
				Key: key,
			}),
		);
		this.logger.info(`[S3] Deleted s3://${bucketName}/${key}`);
	}

	public getClient(): S3Client {
		return this.client;
	}

	public getPublicUrl(key: string, bucket?: string): string {
		const bucketName = bucket ?? this.bucketName;

		if (!bucketName) {
			throw new S3Error({
				message: S3ErrorMessage.MISSING_BUCKET,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return `https://${bucketName}.s3.amazonaws.com/${key}`;
	}

	public async uploadObject({
		body,
		bucket,
		contentType,
		key,
	}: UploadOptions): Promise<{ key: string; url: string }> {
		const bucketName = bucket ?? this.bucketName;

		if (!bucketName) {
			throw new S3Error({
				message: S3ErrorMessage.MISSING_BUCKET,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		await this.client.send(
			new PutObjectCommand({
				Body: body,
				Bucket: bucketName,
				ContentType: contentType,
				Key: key,
			}),
		);

		const url = this.getPublicUrl(key, bucketName);
		this.logger.info(`[S3] Uploaded -> ${url}`);

		return { key, url };
	}
}

export { BaseS3 };
