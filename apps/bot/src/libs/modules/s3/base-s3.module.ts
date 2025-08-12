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

	public constructor({ bucketName, credentials, logger, region }: Constructor) {
		this.bucketName = bucketName;
		this.logger = logger;
		this.client = new S3Client({ credentials, region });
	}

	private buildKey(prefix: string, fileName: string): string {
		const p = this.normalize(prefix);
		const f = this.normalize(fileName);
		const encodedName = f
			.split("/")
			.map((segment) => encodeURIComponent(segment))
			.join("/");

		return p ? `${p}/${encodedName}` : encodedName;
	}

	private normalize(s: string = ""): string {
		return s.replaceAll("\\", "/").split("/").filter(Boolean).join("/");
	}

	public async delete(parameters: S3KeyParameters): Promise<void> {
		const key = this.buildKey(parameters.prefix, parameters.fileName);
		this.logger.info(`[S3] DELETE s3://${this.bucketName}/${key}`);

		await this.client.send(
			new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
		);
	}

	public async upload(parameters: UploadParameters): Promise<UploadResult> {
		const key = this.buildKey(parameters.prefix, parameters.fileName);

		this.logger.info(`[S3] PUT s3://${this.bucketName}/${key}`);

		const out: PutObjectCommandOutput = await this.client.send(
			new PutObjectCommand({
				Body: parameters.body,
				Bucket: this.bucketName,
				ContentType: parameters.contentType ?? "audio/mpeg",
				Key: key,
			}),
		);

		return {
			etag: out.ETag ?? undefined,
			key,
			versionId: out.VersionId ?? undefined,
		};
	}
}

export { BaseS3 };
