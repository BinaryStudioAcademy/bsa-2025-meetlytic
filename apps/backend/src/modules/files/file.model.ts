import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class FileModel extends AbstractModel {
	public contentType!: string;
	public key!: string;
	public url!: string;

	public static override get tableName(): string {
		return DatabaseTableName.FILES;
	}
}

export { FileModel };
