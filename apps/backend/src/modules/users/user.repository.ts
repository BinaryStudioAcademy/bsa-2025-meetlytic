import { type Repository } from "~/libs/types/types.js";
import { UserDetailsEntity } from "~/modules/users/user-details.entity.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";

import { UserAttribute } from "./libs/enums/enums.js";
import { type UserCredentials } from "./libs/types/types.js";

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

	public async findByIdWithDetails(id: number): Promise<null | {
		details: null | UserDetailsEntity;
		user: UserEntity;
	}> {
		const userWithDetails = await this.userModel
			.query()
			.findById(id)
			.withGraphFetched("userDetails");

		if (!userWithDetails) {
			return null;
		}

		const user = UserEntity.initialize({
			email: userWithDetails.email,
			id: userWithDetails.id,
			passwordHash: userWithDetails.passwordHash,
			passwordSalt: userWithDetails.passwordSalt,
		});

		const details = userWithDetails.userDetails
			? UserDetailsEntity.initialize({
					firstName: userWithDetails.userDetails.firstName,
					id: userWithDetails.userDetails.id,
					lastName: userWithDetails.userDetails.lastName,
					userId: userWithDetails.userDetails.userId,
				})
			: null;

		return { details, user };
	}

	public async getCredentials(id: number): Promise<null | UserCredentials> {
		const credentials = await this.userModel
			.query()
			.select(UserAttribute.PASSWORD_HASH, UserAttribute.PASSWORD_SALT)
			.findById(id);

		return credentials ?? null;
	}

	public async update(
		id: number,
		payload: Partial<{ email: string }>,
	): Promise<UserEntity> {
		const updatedUser = await this.userModel
			.query()
			.patchAndFetchById(id, payload)
			.execute();

		return UserEntity.initialize(updatedUser);
	}
}

export { UserRepository };
