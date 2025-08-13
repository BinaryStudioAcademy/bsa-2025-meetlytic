import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

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
	private userDetailsRepository: UserDetailsRepository;
	private userRepository: UserRepository;

	public constructor(
		userRepository: UserRepository,
		userDetailsRepository: UserDetailsRepository,
	) {
		this.userRepository = userRepository;
		this.userDetailsRepository = userDetailsRepository;
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
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new UserError({
				message: UserErrorMessage.USER_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const userData = user.toObject();
		const details = await this.userDetailsRepository.findByUserId(userData.id);
		const detailsData = details?.toObject();

		if (!detailsData) {
			return null;
		}

		return {
			email: userData.email,
			firstName: detailsData.firstName,
			id: userData.id,
			lastName: detailsData.lastName,
		};
	}

	public async getCredentials(id: number): Promise<null | UserCredentials> {
		const credentials = await this.userRepository.getCredentials(id);

		return credentials ?? null;
	}

	public async update(
		userId: number,
		payload: UserUpdateResponseDto,
	): Promise<null | UserEntity> {
		const user = await this.userRepository.findByIdWithDetails(userId);
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

		if (payload.email !== user.toObject().email) {
			const userWithEmail = await this.userRepository.findByEmail(
				payload.email,
			);

			if (userWithEmail && userWithEmail.toObject().id !== userId) {
				throw new UserError({
					message: UserErrorMessage.USER_EMAIL_IN_USE,
					status: HTTPCode.CONFLICT,
				});
			}

			await this.userRepository.update(userId, {
				email: payload.email,
			});
		}

		await this.userDetailsRepository.update(details.toObject().id, {
			firstName: payload.firstName,
			lastName: payload.lastName,
		});

		const updatedUser = await this.userRepository.findByIdWithDetails(userId);

		return updatedUser;
	}
}

export { UserService };
export { type UserResponseDto } from "./libs/types/types.js";
