import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { ColumnName } from "./libs/enums/column-name.enum.js";

class UserDetailsModel extends AbstractModel {
	public firstName!: string;

	public lastName!: string;

	public userId!: number;

	public static get relationMappings() {
		return {
			user: {
				join: {
					from: `${this.tableName}.${ColumnName.USER_ID}`,
					to: `${DatabaseTableName.USERS}.${ColumnName.ID}`,
				},
				modelClass: "./modules/users/user.model.js",
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.USER_DETAILS;
	}
}

export { UserDetailsModel };
