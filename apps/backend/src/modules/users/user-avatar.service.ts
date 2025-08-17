import { FILENAME_SANITIZE_REGEX } from "~/libs/constants/constants.js";
import { s3Instance } from "~/libs/modules/aws/s3.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type FileService } from "~/modules/files/file.service.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	UserAvatarErrorMessage,
	UserErrorMessage,
} from "./libs/enums/enums.js";
import { type UploadAvatarOptions } from "./libs/types/types.js";

class UserAvatarService {
	private bucketName: string;
	private fileService: FileService;
	private userService: UserService;

	public constructor(
		config: Config,
		fileService: FileService,
		userService: UserService,
	) {
		const bucket = config.ENV.AWS.S3_BUCKET_NAME;

		if (!bucket) {
			throw new Error(UserAvatarErrorMessage.BUCKET_NOT_DEFINED);
		}

		this.bucketName = bucket;
		this.fileService = fileService;
		this.userService = userService;
	}

	private buildKey(userId: number, filename: string): string {
		const safe = filename.replace(FILENAME_SANITIZE_REGEX, "_");

		return `avatars/${String(userId)}/${String(Date.now())}_${safe}`;
	}

	public async deleteAvatar(
		userId: number,
	): Promise<{ isDeleted: boolean; message: string }> {
		const detailsId = await this.userService.getOrCreateDetailsId(userId);

		if (!detailsId) {
			throw new Error(UserErrorMessage.DETAILS_NOT_FOUND);
		}

		const avatarKey = await this.fileService.getAvatarKeyForDeletion(detailsId);

		if (!avatarKey) {
			throw new Error(UserAvatarErrorMessage.AVATAR_NOT_SET);
		}

		try {
			await s3Instance.deleteObject({
				bucket: this.bucketName,
				key: avatarKey,
			});

			await this.fileService.removeAvatarRecord(detailsId);

			return {
				isDeleted: true,
				message: UserAvatarErrorMessage.AVATAR_DELETED_SUCCESSFULLY,
			};
		} catch {
			throw new Error(UserAvatarErrorMessage.AVATAR_DELETION_FAILED);
		}
	}

	public async uploadAvatar(
		options: UploadAvatarOptions,
	): Promise<{ key: string; url: string }> {
		const { buffer, filename, mimetype, userId } = options;

		const detailsId = await this.userService.getOrCreateDetailsId(userId);

		if (!detailsId) {
			throw new Error(UserErrorMessage.DETAILS_NOT_FOUND);
		}

		const oldAvatarKey =
			await this.fileService.getAvatarKeyForDeletion(detailsId);

		try {
			const key = this.buildKey(userId, filename);

			const { key: savedKey, url } = await s3Instance.uploadObject({
				body: buffer,
				bucket: this.bucketName,
				contentType: mimetype,
				key,
			});

			const fileRecord = await this.fileService.replaceAvatarRecord({
				key: savedKey,
				url,
				user_details_id: detailsId,
			});

			if (!fileRecord.id) {
				throw new Error(UserAvatarErrorMessage.FILE_RECORD_CREATION_FAILED);
			}

			await this.userService.updateUserDetailsFileId(detailsId, fileRecord.id);

			if (oldAvatarKey) {
				await s3Instance.deleteObject({
					bucket: this.bucketName,
					key: oldAvatarKey,
				});
			}

			return { key: savedKey, url };
		} catch {
			throw new Error(UserAvatarErrorMessage.AVATAR_UPLOAD_FAILED);
		}
	}
}

export { UserAvatarService };
