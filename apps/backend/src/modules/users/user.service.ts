import { type Service } from "~/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserRepository } from "~/modules/users/user.repository.js";

import {
	type UserGetAllResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "./libs/types/types.js";

class UserService implements Service {
	private userRepository: UserRepository;

	public constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	public async create(
		payload: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		const item = await this.userRepository.create(
			UserEntity.initializeNew({
				email: payload.email,
				passwordHash: "HASH", // TODO
				passwordSalt: "SALT", // TODO
			}),
		);

		return item.toObject();
	}

	public delete(): ReturnType<Service["delete"]> {
		return Promise.resolve(true);
	}

	public find(): Promise<null | UserSignUpResponseDto> {
		return Promise.resolve(null);
	}

	public async findAll(): Promise<UserGetAllResponseDto> {
		const items = await this.userRepository.findAll();
		
		return {
			items: items.map((item) => item.toObject()),
		};
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async findById(_id: number): Promise<null | UserSignUpResponseDto> {
		// eslint-disable-next-line sonarjs/no-unused-vars, @typescript-eslint/no-unused-vars, sonarjs/no-dead-store
		const user = await this.userRepository.find(); 
		// eslint-disable-next-line @typescript-eslint/return-await, unicorn/no-useless-promise-resolve-reject
		return Promise.resolve(null);
	}
	
	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}
}

export { UserService };
