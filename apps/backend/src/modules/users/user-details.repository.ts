import { type Repository } from "~/libs/types/types.js";
import { UserDetailsEntity } from "~/modules/users/user-details.entity.js";
import { type UserDetailsModel } from "~/modules/users/user-details.model.js";

class UserDetailsRepository implements Repository {
	private userDetailsModel: typeof UserDetailsModel;

	public constructor(userDetailsModel: typeof UserDetailsModel) {
		this.userDetailsModel = userDetailsModel;
	}

	public async create(entity: UserDetailsEntity): Promise<UserDetailsEntity> {
		const { firstName, lastName, userId } = entity.toNewObject();

		const userDetails = await this.userDetailsModel
			.query()
			.insert({
				firstName,
				lastName,
				userId,
			})
			.returning("*")
			.execute();

		return UserDetailsEntity.initialize(userDetails);
	}

	public delete(): ReturnType<Repository["delete"]> {
		return Promise.resolve(true);
	}

	public find(): ReturnType<Repository["find"]> {
		return Promise.resolve(null);
	}

	public async findAll(): Promise<UserDetailsEntity[]> {
		const userDetails = await this.userDetailsModel.query().execute();

		return userDetails.map((detail) => UserDetailsEntity.initialize(detail));
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { UserDetailsRepository };
