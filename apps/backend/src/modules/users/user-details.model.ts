import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { ColumnName } from "./libs/enums/enums.js";
import { UserModel } from "./user.model.js";

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
				modelClass: UserModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.USER_DETAILS;
	}
}

export { UserDetailsModel };
