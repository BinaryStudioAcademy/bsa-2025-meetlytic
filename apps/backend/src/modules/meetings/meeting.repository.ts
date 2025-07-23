import { type Repository } from "~/libs/types/repository.type.js";

import { type MeetingHostValue } from "./libs/types/types.js";
import { MeetingEntity } from "./meeting.entity.js";
import { type MeetingModel } from "./meeting.model.js";

class MeetingRepository implements Repository<MeetingEntity> {
	private meetingModel: typeof MeetingModel;

	public constructor(meetingModel: typeof MeetingModel) {
		this.meetingModel = meetingModel;
	}

	public async create(entity: MeetingEntity): Promise<MeetingEntity> {
		const { host, instanceId, ownerId } = entity.toNewObject();
		const meet = await this.meetingModel
			.query()
			.insert({ host, instanceId, ownerId })
			.returning("*")
			.execute();

		return MeetingEntity.initialize({
			host: meet.host as MeetingHostValue,
			id: meet.id,
			instanceId: meet.instanceId,
			ownerId: meet.ownerId,
		});
	}

	public async delete(id: number): Promise<boolean> {
		const meet = await this.meetingModel.query().deleteById(id);
		const DELETE_SUCCESS_THRESHOLD = 0;
		return meet > DELETE_SUCCESS_THRESHOLD;
	}

	public async find(id: number): Promise<MeetingEntity | null> {
		const meet = await this.meetingModel.query().findById(id);
		return meet
			? MeetingEntity.initialize({
					host: meet.host as MeetingHostValue,
					id: meet.id,
					instanceId: meet.instanceId,
					ownerId: meet.ownerId,
				})
			: null;
	}

	public async findAll(): Promise<MeetingEntity[]> {
		const meets = await this.meetingModel.query().execute();
		return meets.map((meet) =>
			MeetingEntity.initialize({
				host: meet.host as MeetingHostValue,
				id: meet.id,
				instanceId: meet.instanceId,
				ownerId: meet.ownerId,
			}),
		);
	}

	public async update(
		id: number,
		payload: Partial<Record<string, unknown>>,
	): Promise<MeetingEntity | null> {
		const meet = await this.meetingModel.query().patchAndFetchById(id, payload);

		return MeetingEntity.initialize({
			host: meet.host as MeetingHostValue,
			id: meet.id,
			instanceId: meet.instanceId,
			ownerId: meet.ownerId,
		});
	}
}

export { MeetingRepository };
