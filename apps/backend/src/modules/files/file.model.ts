import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type ContentType } from "./libs/enums/enums.js";

class FileModel extends AbstractModel {
	public contentType!: ValueOf<typeof ContentType>;
	public key!: string;
	public url!: string;

	public static override get tableName(): string {
		return DatabaseTableName.FILES;
	}
}

export { FileModel };
