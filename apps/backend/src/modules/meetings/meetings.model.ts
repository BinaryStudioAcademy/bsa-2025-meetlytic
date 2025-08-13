import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import {
	MeetingAttributes,
	type MeetingHost,
	type MeetingStatus,
	MeetingTranscriptionAttributes,
} from "./libs/enums/enums.js";
import { MeetingTranscriptionModel } from "./meeting-transcription.model.js";

class MeetingModel extends AbstractModel {
	public actionItems!: null | string;

	public host!: ValueOf<typeof MeetingHost>;

	public instanceId!: null | string;

	public meetingId!: string;

	public meetingPassword!: null | string;

	public ownerId!: number;

	public status!: ValueOf<typeof MeetingStatus>;

	public summary!: null | string;

	public static get relationMappings(): RelationMappings {
		return {
			transcriptions: {
				join: {
					from: `${DatabaseTableName.MEETINGS}.${MeetingAttributes.ID}`,
					to: `${DatabaseTableName.MEETING_TRANSCRIPTIONS}.${MeetingTranscriptionAttributes.MEETING_REF_ID}`,
				},
				modelClass: MeetingTranscriptionModel,
				relation: this.HasManyRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.MEETINGS;
	}
}

export { MeetingModel };
