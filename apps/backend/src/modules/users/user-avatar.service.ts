import {
	DEFAULT_ALLOWED_IMAGE_MIME_TYPES,
	DEFAULT_MAX_FILE_SIZE,
	FILENAME_SANITIZE_REGEX,
	TO_MB,
} from "~/libs/constants/constants.js";
import { s3Instance } from "~/libs/modules/aws/s3.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

type UploadAvatarOptions = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

class UserAvatarService {
	private readonly ALLOWED_MIME_TYPES: string[] = [
		...DEFAULT_ALLOWED_IMAGE_MIME_TYPES,
	];

	private bucketName: string;
	private logger: Logger;
	private readonly MAX_FILE_SIZE_BYTES = DEFAULT_MAX_FILE_SIZE;

	public constructor(config: Config, logger: Logger) {
		const bucket = config.ENV.AWS.BUCKET_NAME;

		this.logger = logger;

		if (!bucket) {
			throw new Error("BUCKET_NAME is not defined");
		}

		this.bucketName = bucket;
	}

	private buildKey(userId: number, filename: string): string {
		const safe = filename.replace(FILENAME_SANITIZE_REGEX, "_");

		return `avatars/${String(userId)}/${String(Date.now())}_${safe}`;
	}

	public async deleteAvatar(fileKey: string): Promise<{ isDeleted: boolean }> {
		try {
			await s3Instance.deleteObject({
				bucket: this.bucketName,
				key: fileKey,
			});

			return { isDeleted: true };
		} catch {
			return { isDeleted: false };
		}
	}

	public isValidFileType(mimeType: string): boolean {
		return this.ALLOWED_MIME_TYPES.includes(mimeType);
	}

	public async uploadAvatar(
		options: UploadAvatarOptions,
	): Promise<{ key: string; url: string }> {
		const { buffer, filename, mimetype, userId } = options;

		const key = this.buildKey(userId, filename);

		const { key: savedKey, url } = await s3Instance.uploadObject({
			body: buffer,
			bucket: this.bucketName,
			contentType: mimetype,
			key,
		});

		return { key: savedKey, url };
	}

	public validate(mimetype: string, size: number): void {
		if (!this.ALLOWED_MIME_TYPES.includes(mimetype)) {
			throw new Error(
				"Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
			);
		}

		if (size > this.MAX_FILE_SIZE_BYTES) {
			throw new Error(
				`File too large. Max file size is ${TO_MB(this.MAX_FILE_SIZE_BYTES)} MB.`,
			);
		}
	}
}

export { UserAvatarService };
