import { type BaseS3 } from "~/libs/modules/aws/base-s3.module.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type FileService } from "~/modules/files/files.service.js";
import { type ContentType } from "~/modules/files/libs/enums/enums.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	UserAvatarErrorMessage,
	UserErrorMessage,
} from "./libs/enums/enums.js";
import { type UploadAvatarOptions } from "./libs/types/types.js";

class UserAvatarService {
	private fileService: FileService;
	private s3: BaseS3;
	private userService: UserService;

	public constructor(
		fileService: FileService,
		userService: UserService,
		s3: BaseS3,
	) {
		this.fileService = fileService;
		this.userService = userService;
		this.s3 = s3;
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
			await this.s3.deleteObject({ key: avatarKey });
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
			const key = this.s3.buildKey("avatars", filename, userId);

			const { key: savedKey, url } = await this.s3.uploadObject({
				body: buffer,
				contentType: mimetype,
				key,
			});

			const fileRecord = await this.fileService.replaceAvatarRecord({
				contentType: mimetype as ValueOf<typeof ContentType>,
				key: savedKey,
				url,
				userDetailsId: detailsId,
			});

			if (!fileRecord.id) {
				throw new Error(UserAvatarErrorMessage.FILE_RECORD_CREATION_FAILED);
			}

			await this.userService.updateUserDetailsFileId(detailsId, fileRecord.id);

			if (oldAvatarKey) {
				await this.s3.deleteObject({ key: oldAvatarKey });
			}

			return { key: savedKey, url };
		} catch {
			throw new Error(UserAvatarErrorMessage.AVATAR_UPLOAD_FAILED);
		}
	}
}

export { UserAvatarService };
