import { type Service } from "~/libs/types/types.js";

import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
	type MeetingUpdateRequestDto,
} from "./libs/types/types.js";
import { MeetingEntity } from "./meeting.entity.js";
import { type MeetingRepository } from "./meeting.repository.js";

class MeetingService implements Service<MeetingResponseDto> {
	private meetingRepository: MeetingRepository;

	public constructor(meetingRepository: MeetingRepository) {
		this.meetingRepository = meetingRepository;
	}

	public async create(
		payload: MeetingCreateRequestDto,
	): Promise<MeetingResponseDto> {
		const meeting = MeetingEntity.initializeNew({
			host: payload.host,
			instanceId: payload.instanceId ?? null,
			ownerId: payload.ownerId,
		});

		const created = await this.meetingRepository.create(meeting);

		return created.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		return await this.meetingRepository.delete(id);
	}

	public async find(id: number): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);

		if (!meeting) {
			throw new Error("Meeting not found");
		}

		return meeting.toObject();
	}

	public async findAll(): Promise<MeetingGetAllResponseDto> {
		const items = await this.meetingRepository.findAll();

		return {
			items: items.map((meeting) => meeting.toObject()),
		};
	}

	public async update(
		id: number,
		payload: MeetingUpdateRequestDto,
	): Promise<MeetingResponseDto> {
		const existing = await this.meetingRepository.find(id);

		if (!existing) {
			throw new Error("Cannot update non-existent meeting with ID");
		}

		const updatedEntity = MeetingEntity.initialize({
			host: payload.host,
			id,
			instanceId: payload.instanceId ?? null,
			ownerId: existing.toObject().ownerId,
		});

		const updated = await this.meetingRepository.update(
			id,
			updatedEntity.toNewObject(),
		);

		if (!updated) {
			throw new Error("Failed to update meeting");
		}

		return updated.toObject();
	}
}

export { MeetingService };
