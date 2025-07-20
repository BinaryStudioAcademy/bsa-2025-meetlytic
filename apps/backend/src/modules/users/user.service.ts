import { bcrypt } from "~/libs/modules/bcrypt/bcrypt.js";
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
		const { hash, salt } = await bcrypt.hash(payload.password);
		const item = await this.userRepository.create(
			UserEntity.initializeNew({
				email: payload.email,
				passwordHash: hash,
				passwordSalt: salt,
			}),
		);

		return item.toObject();
	}

	public delete(): ReturnType<Service["delete"]> {
		return Promise.resolve(true);
	}

	public async find(
		id: number,
	): Promise<null | ReturnType<UserEntity["toNewObject"]>> {
		const user = await this.userRepository.find(id);

		return user ? user.toNewObject() : null;
	}

	public async findAll(): Promise<UserGetAllResponseDto> {
		const items = await this.userRepository.findAll();

		return {
			items: items.map((item) => item.toObject()),
		};
	}

	public async findByEmail(
		email: string,
	): Promise<null | ReturnType<UserEntity["toNewObject"]>> {
		const user = await this.userRepository.findByEmail(email);

		return user ? user.toNewObject() : null;
	}

	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}
}

export { UserService };
