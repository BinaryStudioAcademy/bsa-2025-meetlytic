import { type Repository } from "~/libs/types/types.js";

import { UserDetailsEntity } from "./user-details.entity.js";
import { type UserDetailsModel } from "./user-details.model.js";

const NO_ROWS_DELETED = 0;

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

	public async delete(id: number): Promise<boolean> {
		const deletedRows = await this.userDetailsModel.query().deleteById(id);

		return deletedRows > NO_ROWS_DELETED;
	}

	public async find(id: number): Promise<null | UserDetailsEntity> {
		const userDetails = await this.userDetailsModel.query().findById(id);

		return userDetails ? UserDetailsEntity.initialize(userDetails) : null;
	}

	public async findAll(): Promise<UserDetailsEntity[]> {
		const userDetails = await this.userDetailsModel.query().execute();

		return userDetails.map((detail) => UserDetailsEntity.initialize(detail));
	}

	public async findIdByUserId(userId: number): Promise<null | number> {
		const row = await this.userDetailsModel
			.query()
			.findOne("userId", userId)
			.select("id")
			.execute();

		return row?.id ?? null;
	}

	public async update(
		id: number,
		payload: Partial<Record<string, unknown>>,
	): Promise<null | UserDetailsEntity> {
		const existing = await this.userDetailsModel.query().findById(id);

		if (!existing) {
			return null;
		}

		const updated = await this.userDetailsModel
			.query()
			.patchAndFetchById(id, payload);

		return UserDetailsEntity.initialize(updated);
	}
}

export { UserDetailsRepository };
