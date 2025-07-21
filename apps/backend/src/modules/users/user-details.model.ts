import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class UserDetailsModel extends AbstractModel {
	public firstName!: string;

	public lastName!: string;

	public userId!: number;

	public static get relationMappings() {
		return {
			user: {
				join: {
					from: `${this.tableName}.user_id`,
					to: "users.id",
				},
				modelClass: "~/modules/users/user.model.js",
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.USER_DETAILS;
	}
}

export { UserDetailsModel };
