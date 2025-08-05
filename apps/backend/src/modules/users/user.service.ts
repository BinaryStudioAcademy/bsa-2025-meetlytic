import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { type Service } from "~/libs/types/types.js";

import {
	type UserCredentials,
	type UserGetAllResponseDto,
	type UserResponseDto,
	type UserSignUpRequestDto,
	type UserUpdateResponseDto,
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

		if (!user) {
			return null;
		}

		const userObject = user.toObject();
		const details = await this.userDetailsRepository.findByUserId(
			userObject.id,
		);

		const detailsObject = details?.toObject();

		return {
			...userObject,
			firstName: detailsObject?.firstName ?? "",
			lastName: detailsObject?.lastName ?? "",
		};
	}

	public async getCredentials(id: number): Promise<null | UserCredentials> {
		const credentials = await this.userRepository.getCredentials(id);

		return credentials ?? null;
	}

	public async update(
		userId: number,
		payload: UserUpdateResponseDto,
	): Promise<UserUpdateResponseDto> {
		const user = await this.userRepository.find(userId);

		if (!user) {
			throw new Error("User not found");
		}

		if (payload.email !== user.toObject().email) {
			const userWithEmail = await this.userRepository.findByEmail(
				payload.email,
			);

			if (userWithEmail && userWithEmail.toObject().id !== userId) {
				throw new Error("Email already in use");
			}
		}

		await this.userRepository.update(userId, {
			email: payload.email,
		});

		const userDetails = await this.userDetailsRepository.findByUserId(userId);

		if (userDetails) {
			await this.userDetailsRepository.update(userDetails.toObject().id, {
				firstName: payload.firstName ?? "",
				lastName: payload.lastName ?? "",
			});
		}

		const updatedUser = await this.userRepository.find(userId);
		const updatedDetails =
			await this.userDetailsRepository.findByUserId(userId);

		return {
			email: updatedUser?.toObject().email ?? payload.email,
			firstName: updatedDetails?.toObject().firstName ?? "",
			lastName: updatedDetails?.toObject().lastName ?? "",
		};
	}
}

export { UserService };
export { type UserResponseDto } from "./libs/types/types.js";
