import { ec2 } from "~/libs/modules/ec2-cloudformation/ec2-cloudformation.js";
import { MeetingError } from "@meetlytic/shared";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingStatusMessage } from "./libs/enums/enums.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
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

		const newMeeting = await this.meetingRepository.create(meeting);
		return newMeeting.toObject();
	}

	public async delete(id: number, ownerId?: number): Promise<boolean> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError(
				MeetingStatusMessage.MEETING_NOT_FOUND,
				HTTPCode.NOT_FOUND,
			);
		}

		if (ownerId !== undefined && meeting.toObject().ownerId !== ownerId) {
			throw new MeetingError(
				MeetingStatusMessage.FORBIDDEN,
				HTTPCode.FORBIDDEN,
			);
		}

		return await this.meetingRepository.delete(id);
	}

	public async find(id: number, userId?: number): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError(
				MeetingStatusMessage.MEETING_NOT_FOUND,
				HTTPCode.NOT_FOUND,
			);
		}

		if (userId !== undefined && meeting.toObject().ownerId !== userId) {
			throw new MeetingError(
				MeetingStatusMessage.FORBIDDEN,
				HTTPCode.FORBIDDEN,
			);
		}

		return meeting.toObject();
	}

	public async findAll(ownerId: number): Promise<MeetingGetAllResponseDto> {
		const allMeetings = await this.meetingRepository.findAll();
		const filteredMeetings = allMeetings.filter(
			(meeting) => meeting.toObject().ownerId === ownerId,
		);
		return { items: filteredMeetings.map((meeting) => meeting.toObject()) };
	}

	public async update(
		id: number,
		payload: Partial<MeetingResponseDto>,
	): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError(
				MeetingStatusMessage.CANNOT_UPDATE_NON_EXISTENT,
				HTTPCode.NOT_FOUND,
			);
		}

		if (
			(payload as MeetingUpdateRequestDto).ownerId &&
			(payload as MeetingUpdateRequestDto).ownerId !==
				meeting.toObject().ownerId
		) {
			throw new MeetingError(
				MeetingStatusMessage.FORBIDDEN,
				HTTPCode.FORBIDDEN,
			);
		}

		const updatedEntity = MeetingEntity.initialize({
			host: (payload as MeetingUpdateRequestDto).host,
			id,
			instanceId: (payload as MeetingUpdateRequestDto).instanceId ?? null,
			ownerId: meeting.toObject().ownerId,
		});

		const updatedMeeting = await this.meetingRepository.update(
			id,
			updatedEntity.toNewObject(),
		);
		if (!updatedMeeting) {
			throw new MeetingError(
				MeetingStatusMessage.UPDATE_FAILED,
				HTTPCode.BAD_REQUEST,
			);
		}

		return updatedMeeting.toObject();
	}
}

export { MeetingService };
