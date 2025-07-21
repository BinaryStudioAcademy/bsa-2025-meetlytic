import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class UserModel extends AbstractModel {
	public email!: string;

	public passwordHash!: string;

	public passwordSalt!: string;

	public static get relationMappings() {
		return {
			userDetails: {
				join: {
					from: `${this.tableName}.id`,
					to: "user_details.user_id",
				},
				modelClass: "~/modules/users/user-details.model.js",
				relation: this.HasOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}
}

export { UserModel };
