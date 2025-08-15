import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";
import { type FileService } from "~/modules/files/file.service.js";

import { UserErrorMessage } from "./libs/enums/enums.js";
import { UserError } from "./libs/exceptions/exceptions.js";
import {
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
	private userDetailsRepository: UserDetailsRepository;
	private userRepository: UserRepository;

	public constructor(
		userRepository: UserRepository,
		userDetailsRepository: UserDetailsRepository,
		fileService: FileService,
	) {
		this.userRepository = userRepository;
		this.userDetailsRepository = userDetailsRepository;
		this.fileService = fileService;
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

		let avatarFile: null | { key: string; url: string } = null;
		const fileId = details.getFileId();

		if (fileId != null) {
			const file = await this.fileService.findById(fileId);

			if (file && file.url) {
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

	public async getCredentials(id: number): Promise<null | UserCredentials> {
		const credentials = await this.userRepository.getCredentials(id);

		return credentials ?? null;
	}

	public async getOrCreateDetailsId(userId: number): Promise<number> {
		const existingEntity =
			await this.userDetailsRepository.findByUserId(userId);

		if (existingEntity) {
			return existingEntity.toObject().id;
		}

		const created = await this.userDetailsRepository.create(
			UserDetailsEntity.initializeNew({ firstName: "", lastName: "", userId }),
		);

		return created.toObject().id;
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
		fileId: number,
	): Promise<void> {
		await this.userDetailsRepository.updateFileId(detailsId, fileId);
	}
}

export { UserService };
export { type UserResponseDto } from "./libs/types/types.js";
