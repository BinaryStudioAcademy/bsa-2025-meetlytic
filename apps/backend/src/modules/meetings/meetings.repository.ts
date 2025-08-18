import { DELETE_SUCCESS_THRESHOLD } from "~/libs/constants/constants.js";
import { type Repository } from "~/libs/types/types.js";

import { MeetingEntity } from "./meetings.entity.js";
import { type MeetingModel } from "./meetings.model.js";

class MeetingRepository implements Repository<MeetingEntity> {
	private meetingModel: typeof MeetingModel;

	public constructor(meetingModel: typeof MeetingModel) {
		this.meetingModel = meetingModel;
	}

	public async create(entity: MeetingEntity): Promise<MeetingEntity> {
		const payload = entity.toNewObject();
		const meeting = await this.meetingModel
			.query()
			.insert(payload)
			.returning("*")
			.execute();

		return MeetingEntity.initialize(meeting);
	}

	public async delete(id: number): Promise<boolean> {
		const meeting = await this.meetingModel.query().deleteById(id);

		return meeting > DELETE_SUCCESS_THRESHOLD;
	}

	public async find(id: number): Promise<MeetingEntity | null> {
		const meeting = await this.meetingModel.query().findById(id);

		return meeting ? MeetingEntity.initialize(meeting) : null;
	}

	public async findAll(
		query: Record<string, unknown>,
	): Promise<MeetingEntity[]> {
		const meetings = await this.meetingModel.query().where(query).execute();

		return meetings.map((meeting) => MeetingEntity.initialize(meeting));
	}

	public async findAllByOwnerId(ownerId: number): Promise<MeetingEntity[]> {
		const meetings = await this.meetingModel
			.query()
			.where({ ownerId })
			.execute();

		return meetings.map((meeting) => MeetingEntity.initialize(meeting));
	}

	public async findLatestByMeetingId(
		meetingId: string,
	): Promise<MeetingEntity | null> {
		const meeting = await this.meetingModel
			.query()
			.where({ meetingId })
			.orderBy("createdAt", "desc")
			.first();

		return meeting ? MeetingEntity.initialize(meeting) : null;
	}

	public async update(
		id: number,
		payload: Partial<Record<string, unknown>>,
	): Promise<MeetingEntity | null> {
		const meeting = await this.meetingModel
			.query()
			.patchAndFetchById(id, payload);

		return MeetingEntity.initialize(meeting);
	}
}

export { MeetingRepository };
