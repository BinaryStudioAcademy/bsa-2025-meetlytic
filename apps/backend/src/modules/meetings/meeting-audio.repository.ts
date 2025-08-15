import { DELETE_SUCCESS_THRESHOLD } from "~/libs/constants/constants.js";
import { type Repository } from "~/libs/types/types.js";

import { MeetingAudioEntity } from "./meeting-audio.entity.js";
import { type MeetingAudioModel } from "./meeting-audio.model.js";

class MeetingAudioRepository implements Repository<MeetingAudioEntity> {
	private model: typeof MeetingAudioModel;

	public constructor(model: typeof MeetingAudioModel) {
		this.model = model;
	}

	public async create(entity: MeetingAudioEntity): Promise<MeetingAudioEntity> {
		const created = await this.model
			.query()
			.insert(entity.toNewObject())
			.returning("*")
			.execute();

		return MeetingAudioEntity.initialize(created);
	}

	public async delete(id: number): Promise<boolean> {
		const deletedAudioCount = await this.model.query().deleteById(id).execute();

		return deletedAudioCount > DELETE_SUCCESS_THRESHOLD;
	}

	public async find(id: number): Promise<MeetingAudioEntity | null> {
		const row = await this.model.query().findById(id);

		return row ? MeetingAudioEntity.initialize(row) : null;
	}

	public async findAll(
		query: Partial<Record<string, unknown>> = {},
	): Promise<MeetingAudioEntity[]> {
		const rows = await this.model.query().where(query).execute();

		return rows.map((row) => MeetingAudioEntity.initialize(row));
	}

	public async findByMeetingId(
		meetingId: number,
	): Promise<MeetingAudioEntity[]> {
		const rows = await this.model
			.query()
			.where("meeting_id", meetingId)
			.orderBy("created_at", "asc")
			.execute();

		return rows.map((row) => MeetingAudioEntity.initialize(row));
	}

	public async update(
		id: number,
		payload: Partial<MeetingAudioModel>,
	): Promise<MeetingAudioEntity | null> {
		const audio = await this.model.query().patchAndFetchById(id, payload);

		return MeetingAudioEntity.initialize(audio);
	}
}

export { MeetingAudioRepository };
