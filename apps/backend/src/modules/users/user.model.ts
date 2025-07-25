import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { ColumnName } from "./libs/enums/enums.js";
import { UserDetailsModel } from "./user-details.model.js";

class UserModel extends AbstractModel {
	public email!: string;

	public passwordHash!: string;

	public passwordSalt!: string;

	public static get relationMappings(): RelationMappings {
		return {
			userDetails: {
				join: {
					from: `${DatabaseTableName.USERS}.${ColumnName.ID}`,
					to: `${DatabaseTableName.USER_DETAILS}.${ColumnName.USER_ID}`,
				},
				modelClass: UserDetailsModel,
				relation: this.HasOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}
}

export { UserModel };
