import {
	DeleteObjectCommand,
	PutObjectCommand,
	type PutObjectCommandOutput,
	S3Client,
} from "@aws-sdk/client-s3";

import { type Logger } from "~/libs/modules/logger/logger.js";

import {
	type S3KeyParameters,
	type UploadParameters,
	type UploadResult,
} from "./libs/types/types.js";

type Constructor = {
	bucketName: string;
	credentials: {
		accessKeyId: string;

		secretAccessKey: string;
	};
	logger: Logger;
	region: string;
};

class BaseS3 {
	private bucketName: string;
	private client: S3Client;
	private logger: Logger;
	private region: string;

	public constructor({ bucketName, credentials, logger, region }: Constructor) {
		this.bucketName = bucketName;
		this.logger = logger;
		this.region = region;
		this.client = new S3Client({ credentials, region });
	}

	private buildHttpsUrl(key: string): string {
		const host = `s3.${this.region}.amazonaws.com`;

		if (this.bucketName.includes(".")) {
			return `https://${host}/${this.bucketName}/${key}`;
		}

		return `https://${this.bucketName}.${host}/${key}`;
	}

	private buildKey(folderPrefix: string, originalFileName: string): string {
		const normalizedPrefix = this.normalizePathSegment(folderPrefix);
		const normalizedFileName = this.normalizePathSegment(originalFileName);

		const encodedFileName = normalizedFileName
			.split("/")
			.map((pathSegment) => encodeURIComponent(pathSegment))
			.join("/");

		return normalizedPrefix
			? `${normalizedPrefix}/${encodedFileName}`
			: encodedFileName;
	}

	private normalizePathSegment(inputPath: string = ""): string {
		return inputPath.replaceAll("\\", "/").split("/").filter(Boolean).join("/");
	}

	public async delete(parameters: S3KeyParameters): Promise<void> {
		const key = this.buildKey(parameters.prefix, parameters.fileName);
		this.logger.info(`[S3] DELETE s3://${this.bucketName}/${key}`);

		await this.client.send(
			new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
		);
	}

	public async upload(parameters: UploadParameters): Promise<UploadResult> {
		const objectKey = this.buildKey(parameters.prefix, parameters.fileName);

		this.logger.info(`[S3] PUT s3://${this.bucketName}/${objectKey}`);

		const uploadResultAws: PutObjectCommandOutput = await this.client.send(
			new PutObjectCommand({
				Body: parameters.body,
				Bucket: this.bucketName,
				ContentType: parameters.contentType ?? "audio/mpeg",
				Key: objectKey,
			}),
		);

		return {
			etag: uploadResultAws.ETag ?? undefined,
			key: objectKey,
			url: this.buildHttpsUrl(objectKey),
			versionId: uploadResultAws.VersionId ?? undefined,
		};
	}
}

export { BaseS3 };
