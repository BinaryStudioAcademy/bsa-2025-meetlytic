import { DELETE_SUCCESS_THRESHOLD } from "~/libs/constants/constants.js";
import { type Repository } from "~/libs/types/types.js";

import { MeetingEntity } from "./meeting.entity.js";
import { type MeetingModel } from "./meeting.model.js";

class MeetingRepository implements Repository<MeetingEntity> {
	private meetingModel: typeof MeetingModel;

	public constructor(meetingModel: typeof MeetingModel) {
		this.meetingModel = meetingModel;
	}

	public async create(entity: MeetingEntity): Promise<MeetingEntity> {
		const { host, instanceId, ownerId } = entity.toNewObject();
		const meeting = await this.meetingModel
			.query()
			.insert({ host, instanceId, ownerId })
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

	public async findAll(): Promise<MeetingEntity[]> {
		const meetings = await this.meetingModel.query().execute();
		return meetings.map((meeting) => MeetingEntity.initialize(meeting));
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
