import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { MeetingAttribute } from "../meetings/libs/enums/enums.js";
import { MeetingModel } from "../meetings/meetings.model.js";

class MeetingAudioModel extends AbstractModel {
	public fileName!: string;
	public fileUrl!: string;
	public meetingId!: number;

	public static get relationMappings(): RelationMappings {
		return {
			meeting: {
				join: {
					from: `${this.tableName}.meeting_id`,
					to: `${DatabaseTableName.MEETINGS}.${MeetingAttribute.ID}`,
				},
				modelClass: MeetingModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.MEETING_AUDIO;
	}
}

export { MeetingAudioModel };
