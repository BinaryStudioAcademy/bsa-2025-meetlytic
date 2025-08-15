import { Model } from "objection";

import { TableName } from "./libs/enums/enums.js";

class FileModel extends Model {
	public created_at!: string;
	public id!: number;
	public key!: string;
	public type!: string;
	public updated_at!: string;
	public url!: string;

	public static get tableName(): string {
		return TableName.FILES;
	}
}

export { FileModel };
