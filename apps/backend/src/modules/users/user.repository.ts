import { type Repository } from "~/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";

import { UserAttribute } from "./libs/enums/enums.js";
import { UserCredentials } from "./libs/types/types.js";

class UserRepository implements Repository {
	private userModel: typeof UserModel;
	public constructor(userModel: typeof UserModel) {
		this.userModel = userModel;
	}

	public async create(entity: UserEntity): Promise<UserEntity> {
		const { email, passwordHash, passwordSalt } = entity.toNewObject();

		const user = await this.userModel
			.query()
			.insert({
				email,
				passwordHash,
				passwordSalt,
			})
			.returning("*")
			.execute();

		return UserEntity.initialize(user);
	}

	public delete(): ReturnType<Repository["delete"]> {
		return Promise.resolve(true);
	}

	public async find(id: number): Promise<null | UserEntity> {
		const user = await this.userModel.query().findById(id);
		return user ? UserEntity.initialize(user) : null;
	}

	public async findAll(): Promise<UserEntity[]> {
		const users = await this.userModel.query().execute();

		return users.map((user) => UserEntity.initialize(user));
	}

	public async findByEmail(email: string): Promise<null | UserEntity> {
		const user = await this.userModel
			.query()
			.findOne(UserAttribute.EMAIL, email);
		return user ? UserEntity.initialize(user) : null;
	}

	public async getCredentials(id: number): Promise<null | UserCredentials> {
		const credentials = await this.userModel
			.query()
			.select(UserAttribute.PASSWORD_HASH, UserAttribute.PASSWORD_SALT)
			.findById(id);

		return credentials
			? {
					passwordHash: credentials.passwordHash,
					passwordSalt: credentials.passwordSalt,
				}
			: null;
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { UserRepository };
