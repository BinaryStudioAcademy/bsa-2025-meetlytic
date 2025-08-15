import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import {
	MeetingAttribute,
	MeetingTranscriptionAttribute,
} from "./libs/enums/enums.js";
import { MeetingModel } from "./meetings.model.js";

class MeetingTranscriptionModel extends AbstractModel {
	public chunkText!: string;
	public meetingId!: number;

	public static get relationMappings(): RelationMappings {
		return {
			meeting: {
				join: {
					from: `${this.tableName}.${MeetingTranscriptionAttribute.MEETING_ID}`,
					to: `${DatabaseTableName.MEETINGS}.${MeetingAttribute.ID}`,
				},
				modelClass: MeetingModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.MEETING_TRANSCRIPTIONS;
	}
}

export { MeetingTranscriptionModel };
