import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";
import { FileModel } from "~/modules/files/file.model.js";

import {
	MeetingAttribute,
	type MeetingHost,
	type MeetingStatus,
	MeetingTranscriptionAttribute,
} from "./libs/enums/enums.js";
import { type FilePublicDto } from "./libs/types/types.js";
import { MeetingTranscriptionModel } from "./meeting-transcription.model.js";

class MeetingModel extends AbstractModel {
	public actionItems!: null | string;

	public audioFile!: FilePublicDto | null;

	public audioFileId!: null | number;

	public host!: ValueOf<typeof MeetingHost>;

	public instanceId!: null | string;

	public meetingId!: string;

	public meetingPassword!: null | string;

	public ownerId!: number;

	public status!: ValueOf<typeof MeetingStatus>;

	public summary!: null | string;

	public title!: null | string;

	public static get relationMappings(): RelationMappings {
		return {
			audioFile: {
				join: {
					from: `${DatabaseTableName.MEETINGS}.${MeetingAttribute.AUDIO_FILE_ID}`,
					to: `${DatabaseTableName.FILES}.id`,
				},
				modelClass: FileModel,
				relation: this.BelongsToOneRelation,
			},
			transcriptions: {
				join: {
					from: `${DatabaseTableName.MEETINGS}.${MeetingAttribute.ID}`,
					to: `${DatabaseTableName.MEETING_TRANSCRIPTIONS}.${MeetingTranscriptionAttribute.MEETING_ID}`,
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
