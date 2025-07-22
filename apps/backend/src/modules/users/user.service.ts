import { bcrypt } from "~/libs/modules/bcrypt/bcrypt.js";
import { type Service } from "~/libs/types/types.js";

import {
	type UserGetAllResponseDto,
	type UserResponseDto,
	type UserSignUpRequestDto,
} from "./libs/types/types.js";
import { UserDetailsEntity } from "./user-details.entity.js";
import { type UserDetailsRepository } from "./user-details.repository.js";
import { UserEntity } from "./user.entity.js";
import { UserRepository } from "./user.repository.js";

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
		const { hash, salt } = await bcrypt.hash(payload.password);
		const user = await this.userRepository.create(
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
				userId: user.toObject().id,
			}),
		);

		return user.toObject();
	}

	public delete(): ReturnType<Service["delete"]> {
		return Promise.resolve(true);
	}

	public find(): ReturnType<Service["find"]> {
		return Promise.resolve(null);
	}

	public async findAll(): Promise<UserGetAllResponseDto> {
		const items = await this.userRepository.findAll();

		return {
			items: items.map((item) => item.toObject()),
		};
	}

	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}
}

export { UserService };
