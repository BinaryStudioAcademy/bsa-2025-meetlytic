import { DELETE_SUCCESS_THRESHOLD } from "~/libs/constants/constants.js";
import { type Repository } from "~/libs/types/types.js";

import {
	MeetingTranscriptionAttribute,
	SortOrder,
} from "./libs/enums/enums.js";
import { MeetingTranscriptionEntity } from "./meeting-transcription.entity.js";
import { type MeetingTranscriptionModel } from "./meeting-transcription.model.js";

class MeetingTranscriptionRepository
	implements Repository<MeetingTranscriptionEntity>
{
	private meetingTranscriptionModel: typeof MeetingTranscriptionModel;

	public constructor(
		meetingTranscriptionModel: typeof MeetingTranscriptionModel,
	) {
		this.meetingTranscriptionModel = meetingTranscriptionModel;
	}

	public async create(
		entity: MeetingTranscriptionEntity,
	): Promise<MeetingTranscriptionEntity> {
		const payload = entity.toNewObject();
		const createdTranscription = await this.meetingTranscriptionModel
			.query()
			.insert(payload)
			.returning("*")
			.execute();

		return MeetingTranscriptionEntity.initialize(createdTranscription);
	}

	public async delete(id: number): Promise<boolean> {
		const deletedTranscriptionsCount = await this.meetingTranscriptionModel
			.query()
			.deleteById(id)
			.execute();

		return deletedTranscriptionsCount > DELETE_SUCCESS_THRESHOLD;
	}

	public async find(id: number): Promise<MeetingTranscriptionEntity | null> {
		const transcription = await this.meetingTranscriptionModel
			.query()
			.findById(id);

		return transcription
			? MeetingTranscriptionEntity.initialize(transcription)
			: null;
	}

	public async findAll(
		query: Partial<Record<string, unknown>> = {},
	): Promise<MeetingTranscriptionEntity[]> {
		const transcriptions = await this.meetingTranscriptionModel
			.query()
			.where(query)
			.execute();

		return transcriptions.map((transcription) =>
			MeetingTranscriptionEntity.initialize(transcription),
		);
	}

	public async findByMeetingId(
		meetingId: number,
	): Promise<MeetingTranscriptionEntity[]> {
		const transcriptions = await this.meetingTranscriptionModel
			.query()
			.where(MeetingTranscriptionAttribute.MEETING_ID, meetingId)
			.orderBy(MeetingTranscriptionAttribute.CREATED_AT, SortOrder.ASC)
			.execute();

		return transcriptions.map((transcription) =>
			MeetingTranscriptionEntity.initialize(transcription),
		);
	}

	public async update(
		id: number,
		payload: Partial<MeetingTranscriptionModel>,
	): Promise<MeetingTranscriptionEntity | null> {
		const transcription = await this.meetingTranscriptionModel
			.query()
			.patchAndFetchById(id, payload);

		return MeetingTranscriptionEntity.initialize(transcription);
	}
}

export { MeetingTranscriptionRepository };
