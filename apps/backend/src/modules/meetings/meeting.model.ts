import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class MeetingModel extends AbstractModel {
	public host!: string;

	public instanceId!: null | string;

	public ownerId!: number;

	public static override get tableName(): string {
		return DatabaseTableName.MEETINGS;
	}
}

export { MeetingModel };
