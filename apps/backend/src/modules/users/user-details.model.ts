import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { FileModel } from "~/modules/files/file.model.js";

import { ColumnName } from "./libs/enums/enums.js";
import { UserModel } from "./user.model.js";

class UserDetailsModel extends AbstractModel {
	public fileId!: null | number;

	public firstName!: string;

	public lastName!: string;

	public userId!: number;

	public static get relationMappings(): RelationMappings {
		return {
			avatarFile: {
				join: {
					from: `${DatabaseTableName.USER_DETAILS}.${ColumnName.FILE_ID}`,
					to: `${DatabaseTableName.FILES}.id`,
				},
				modelClass: FileModel,
				relation: this.HasOneRelation,
			},
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
