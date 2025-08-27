import { type BaseS3 } from "~/libs/modules/aws/base-s3.module.js";
import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	type AvatarFileDto,
	type DeleteAvatarResult,
	type Service,
	type ValueOf,
} from "~/libs/types/types.js";
import { type FileService } from "~/modules/files/files.service.js";
import { type ContentType } from "~/modules/files/libs/enums/enums.js";
import {
	type FileRequestDto,
	type FileResponseDto,
} from "~/modules/files/libs/types/types.js";
import { type UserDetailsModel } from "~/modules/users/user-details.model.js";

import {
	UserAvatarErrorMessage,
	UserErrorMessage,
} from "./libs/enums/enums.js";
import { UserError } from "./libs/exceptions/exceptions.js";
import {
	type UploadAvatarOptions,
	type UserCredentials,
	type UserGetAllResponseDto,
	type UserResponseDto,
	type UserSignUpRequestDto,
	type UserUpdateResponseDto,
	type UserWithDetailsDto,
} from "./libs/types/types.js";
import { UserDetailsEntity } from "./user-details.entity.js";
import { type UserDetailsRepository } from "./user-details.repository.js";
import { UserEntity } from "./user.entity.js";
import { type UserRepository } from "./user.repository.js";

class UserService implements Service {
	private fileService: FileService;
	private s3: BaseS3;
	private userDetailsModel: typeof UserDetailsModel;
	private userDetailsRepository: UserDetailsRepository;
	private userRepository: UserRepository;

	public constructor({
		fileService,
		s3,
		userDetailsModel,
		userDetailsRepository,
		userRepository,
	}: {
		fileService: FileService;
		s3: BaseS3;
		userDetailsModel: typeof UserDetailsModel;
		userDetailsRepository: UserDetailsRepository;
		userRepository: UserRepository;
	}) {
		this.userRepository = userRepository;
		this.userDetailsRepository = userDetailsRepository;
		this.fileService = fileService;
		this.s3 = s3;
		this.userDetailsModel = userDetailsModel;
	}

	private async getAvatarFileId(userDetailsId: number): Promise<null | number> {
		const userDetails = await this.userDetailsModel
			.query()
			.findById(userDetailsId)
			.select("avatarFileId")
			.first();

		return userDetails?.avatarFileId ?? null;
	}

	public async create(payload: UserSignUpRequestDto): Promise<UserResponseDto> {
		const { hash, salt } = await encrypt.hash(payload.password);
		const item = await this.userRepository.create(
			UserEntity.initializeNew({
				email: payload.email,
				passwordHash: hash,
				passwordSalt: salt,
			}),
		);

		await this.userDetailsRepository.create(
			UserDetailsEntity.initializeNew({
				firstName: payload.firstName,
				lastName: payload.lastName,
				userId: item.toObject().id,
			}),
		);

		return item.toObject();
	}

	public delete(): ReturnType<Service["delete"]> {
		return Promise.resolve(true);
	}

	public async deleteAvatar(userId: number): Promise<DeleteAvatarResult> {
		const detailsId = await this.getDetailsId(userId);

		if (!detailsId) {
			throw new Error(UserErrorMessage.DETAILS_NOT_FOUND);
		}

		const avatarKey = await this.getAvatarKeyForDeletion(detailsId);

		if (!avatarKey) {
			throw new Error(UserAvatarErrorMessage.AVATAR_NOT_SET);
		}

		try {
			await this.s3.deleteObject({ key: avatarKey });
			await this.removeAvatarRecord(detailsId);

			return {
				isDeleted: true,
				message: UserAvatarErrorMessage.AVATAR_DELETED_SUCCESSFULLY,
			};
		} catch {
			throw new Error(UserAvatarErrorMessage.AVATAR_DELETION_FAILED);
		}
	}

	public async find(id: number): Promise<null | UserResponseDto> {
		const user = await this.userRepository.find(id);

		return user ? user.toObject() : null;
	}

	public async findAll(): Promise<UserGetAllResponseDto> {
		const items = await this.userRepository.findAll();

		return {
			items: items.map((item) => item.toObject()),
		};
	}

	public async findAvatarByUserDetailsId(
		userDetailsId: number,
	): Promise<FileResponseDto | null> {
		const fileId = await this.getAvatarFileId(userDetailsId);

		if (!fileId) {
			return null;
		}

		const avatar = await this.fileService.find(fileId);

		return avatar;
	}

	public async findByEmail(email: string): Promise<null | UserResponseDto> {
		const user = await this.userRepository.findByEmail(email);

		return user ? user.toObject() : null;
	}

	public async findProfileByEmail(
		email: string,
	): Promise<null | UserWithDetailsDto> {
		const user = await this.userRepository.findByEmailWithDetails(email);
		const details = user?.getDetails();

		if (!user) {
			throw new UserError({
				message: UserErrorMessage.USER_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (!details) {
			return null;
		}

		let avatarFile: AvatarFileDto | null = null;
		const avatarFileId = details.getAvatarFileId();

		if (avatarFileId) {
			const file = await this.fileService.find(avatarFileId);

			if (file.url) {
				avatarFile = { key: file.key, url: file.url };
			}
		}

		return {
			details: {
				...details.toObject(),
				avatarFile,
			},
			email: user.toObject().email,
			firstName: details.toObject().firstName,
			id: user.toObject().id,
			lastName: details.toObject().lastName,
		};
	}

	public async getAvatarKeyForDeletion(
		userDetailsId: number,
	): Promise<null | string> {
		const dto = await this.findAvatarByUserDetailsId(userDetailsId);

		return dto?.key ?? null;
	}

	public async getCredentials(id: number): Promise<null | UserCredentials> {
		const credentials = await this.userRepository.getCredentials(id);

		return credentials ?? null;
	}

	public async getDetailsId(userId: number): Promise<number> {
		const details = await this.userDetailsRepository.findByUserId(userId);

		if (!details) {
			throw new UserError({
				message: UserErrorMessage.DETAILS_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return details.toObject().id;
	}

	public async removeAvatarRecord(userDetailsId: number): Promise<boolean> {
		const fileId = await this.getAvatarFileId(userDetailsId);

		if (!fileId) {
			return false;
		}

		const isDeleted = await this.fileService.delete(fileId);
		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: null })
			.where("id", userDetailsId);

		return isDeleted;
	}

	public async replaceAvatarRecord(parameters: {
		contentType: FileRequestDto["contentType"];
		key: AvatarFileDto["key"];
		url: AvatarFileDto["url"];
		userDetailsId: number;
	}): Promise<FileResponseDto> {
		const { userDetailsId, ...fileData } = parameters;

		const existingId = await this.getAvatarFileId(userDetailsId);

		if (existingId) {
			return await this.fileService.update(existingId, fileData);
		}

		const created = await this.fileService.create(fileData);

		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: created.id })
			.where("id", userDetailsId);

		return created;
	}

	public async update(
		userId: number,
		payload: UserUpdateResponseDto,
	): Promise<null | UserWithDetailsDto> {
		const existingUser = await this.userRepository.findByIdWithDetails(userId);
		const existingDetails = existingUser?.getDetails();

		if (!existingUser) {
			throw new UserError({
				message: UserErrorMessage.USER_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (!existingDetails) {
			return null;
		}

		if (payload.email !== existingUser.toObject().email) {
			const userWithEmail = await this.userRepository.findByEmail(
				payload.email,
			);

			if (userWithEmail && userWithEmail.toObject().id !== userId) {
				throw new UserError({
					message: UserErrorMessage.USER_EMAIL_IN_USE,
					status: HTTPCode.CONFLICT,
				});
			}
		}

		const updatedUser = await this.userRepository.update(userId, {
			email: payload.email,
		});

		const updatedDetails = await this.userDetailsRepository.update(
			existingDetails.toObject().id,
			{
				firstName: payload.firstName,
				lastName: payload.lastName,
			},
		);

		if (!updatedDetails) {
			return null;
		}

		return {
			email: updatedUser.toObject().email,
			firstName: updatedDetails.toObject().firstName,
			id: updatedUser.toObject().id,
			lastName: updatedDetails.toObject().lastName,
		};
	}

	public async updateUserDetailsFileId(
		detailsId: number,
		avatarFileId: number,
	): Promise<void> {
		await this.userDetailsRepository.updateFileId(detailsId, avatarFileId);
	}

	public async uploadAvatar(
		options: UploadAvatarOptions,
	): Promise<AvatarFileDto> {
		const { buffer, filename, mimetype, userId } = options;

		const detailsId = await this.getDetailsId(userId);

		if (!detailsId) {
			throw new Error(UserErrorMessage.DETAILS_NOT_FOUND);
		}

		const oldAvatarKey = await this.getAvatarKeyForDeletion(detailsId);

		try {
			const key = this.s3.buildKey("avatars", filename, userId);

			const { key: savedKey, url } = await this.s3.uploadObject({
				body: buffer,
				contentType: mimetype,
				key,
			});

			const fileRecord = await this.replaceAvatarRecord({
				contentType: mimetype as ValueOf<typeof ContentType>,
				key: savedKey,
				url,
				userDetailsId: detailsId,
			});

			if (!fileRecord.id) {
				throw new Error(UserAvatarErrorMessage.FILE_RECORD_CREATION_FAILED);
			}

			await this.updateUserDetailsFileId(detailsId, fileRecord.id);

			if (oldAvatarKey) {
				await this.s3.deleteObject({ key: oldAvatarKey });
			}

			return { key: savedKey, url };
		} catch {
			throw new Error(UserAvatarErrorMessage.AVATAR_UPLOAD_FAILED);
		}
	}
}

export { UserService };
export { type UserResponseDto } from "./libs/types/types.js";
