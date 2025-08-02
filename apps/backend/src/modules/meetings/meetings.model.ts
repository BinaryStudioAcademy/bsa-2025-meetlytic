import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type MeetingHost, type MeetingStatus } from "./libs/enums/enums.js";

class MeetingModel extends AbstractModel {
	public host!: ValueOf<typeof MeetingHost>;

	public instanceId!: null | string;

	public meetingId!: string;

	public meetingPassword!: null | string;

	public ownerId!: number;

	public status!: ValueOf<typeof MeetingStatus>;

	public static override get tableName(): string {
		return DatabaseTableName.MEETINGS;
	}
}

export { MeetingModel };
