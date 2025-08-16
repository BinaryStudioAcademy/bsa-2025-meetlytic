import { FILENAME_SANITIZE_REGEX } from "~/libs/constants/constants.js";
import { s3Instance } from "~/libs/modules/aws/s3.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { UserAvatarErrorMessage } from "./libs/enums/enums.js";

type UploadAvatarOptions = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

class UserAvatarService {
	private bucketName: string;
	private logger: Logger;

	public constructor(config: Config, logger: Logger) {
		const bucket = config.ENV.AWS.BUCKET_NAME;

		this.logger = logger;

		if (!bucket) {
			throw new Error(UserAvatarErrorMessage.BUCKET_NOT_DEFINED);
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
}

export { UserAvatarService };
