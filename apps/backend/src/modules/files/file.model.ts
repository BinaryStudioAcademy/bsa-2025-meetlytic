import { AbstractModel } from "~/libs/modules/database/database.js";

import { TableName } from "./libs/enums/enums.js";

class FileModel extends AbstractModel {
	public contentType!: string;
	public key!: string;
	public url!: string;

	public static override get tableName(): string {
		return TableName.FILES;
	}
}

export { FileModel };
