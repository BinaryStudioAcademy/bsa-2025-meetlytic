import { MeetingError } from "@meetlytic/shared";

import { ec2 } from "~/libs/modules/ec2-cloudformation/ec2-cloudformation.js";
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
		const { id } = newMeeting.toObject();

		if (!id) {
			throw new MeetingError({
				message: MeetingStatusMessage.MEETING_FAILD_TO_CREATE,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const instanceId = await ec2.create(id);
		const updated = await this.meetingRepository.update(id, {
			instanceId,
		});
		if (!updated) {
			throw new MeetingError({
				message: MeetingStatusMessage.UPDATE_FAILED,
				status: HTTPCode.NOT_FOUND,
			});
		}
		return updated.toObject();
	}

	public async delete(id: number, ownerId?: number): Promise<boolean> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError({
				message: MeetingStatusMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (ownerId !== undefined && meeting.toObject().ownerId !== ownerId) {
			throw new MeetingError({
				message: MeetingStatusMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}

		return await this.meetingRepository.delete(id);
	}

	public async find(id: number, userId?: number): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError({
				message: MeetingStatusMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (userId !== undefined && meeting.toObject().ownerId !== userId) {
			throw new MeetingError({
				message: MeetingStatusMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
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
			throw new MeetingError({
				message: MeetingStatusMessage.CANNOT_UPDATE_NON_EXISTENT,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (payload.ownerId && payload.ownerId !== meeting.toObject().ownerId) {
			throw new MeetingError({
				message: MeetingStatusMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}

		const updatedEntity = MeetingEntity.initialize({
			host: payload.host as "zoom",
			id,
			instanceId: payload.instanceId ?? null,
			ownerId: meeting.toObject().ownerId,
		});

		const updatedMeeting = await this.meetingRepository.update(
			id,
			updatedEntity.toNewObject(),
		);
		if (!updatedMeeting) {
			throw new MeetingError({
				message: MeetingStatusMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updatedMeeting.toObject();
	}
}

export { MeetingService };
