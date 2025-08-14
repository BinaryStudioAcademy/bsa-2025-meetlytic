import { Model, type RelationMappings } from "objection";

import { UserDetailsModel } from "~/modules/users/user-details.model.js";

import { TableName } from "./libs/enums/enums.js";

class FileModel extends Model {
	public created_at!: string;
	public id!: number;
	public key!: string;
	public type!: string;
	public updated_at!: string;
	public url!: string;

	public static get relationMappings(): RelationMappings {
		return {
			userDetails: {
				join: {
					from: `${TableName.FILES}.id`,
					to: `${TableName.USER_DETAILS}.file_id`,
				},
				modelClass: UserDetailsModel,
				relation: Model.HasOneRelation,
			},
		};
	}

	public static get tableName(): string {
		return TableName.FILES;
	}
}

export { FileModel };
