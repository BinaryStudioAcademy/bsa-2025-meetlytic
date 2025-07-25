import { type CloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.module.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingStatusMessage } from "./libs/enums/enums.js";
import { MeetingError } from "./libs/exceptions/exceptions.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
} from "./libs/types/types.js";
import { MeetingEntity } from "./meeting.entity.js";
import { type MeetingRepository } from "./meeting.repository.js";

class MeetingService implements Service<MeetingResponseDto> {
	private cloudFormation: CloudFormation;
	private meetingRepository: MeetingRepository;
	private userId: number;

	constructor(
		repo: MeetingRepository,
		userId: number,
		cloudFormation: CloudFormation,
	) {
		this.meetingRepository = repo;
		this.userId = userId;
		this.cloudFormation = cloudFormation;
	}

	private getCurrentUserId(): number {
		return this.userId;
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
				message: MeetingStatusMessage.MEETING_FAILED_TO_CREATE,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const instanceId = await this.cloudFormation.create(id);
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

	public async delete(id: number): Promise<boolean> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError({
				message: MeetingStatusMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (meeting.toObject().ownerId !== this.getCurrentUserId()) {
			throw new MeetingError({
				message: MeetingStatusMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}

		return await this.meetingRepository.delete(id);
	}

	public async find(id: number): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError({
				message: MeetingStatusMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (meeting.toObject().ownerId !== this.getCurrentUserId()) {
			throw new MeetingError({
				message: MeetingStatusMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}

		return meeting.toObject();
	}

	public async findAll(): Promise<MeetingGetAllResponseDto> {
		const allMeetings = await this.meetingRepository.findAll();
		const userId = this.getCurrentUserId();

		return {
			items: allMeetings
				.filter((m) => m.toObject().ownerId === userId)
				.map((m) => m.toObject()),
		};
	}

	public async update(
		id: number,
		payload: Partial<MeetingUpdateRequestDto>,
	): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);
		if (!meeting) {
			throw new MeetingError({
				message: MeetingStatusMessage.CANNOT_UPDATE_NON_EXISTENT,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (meeting.toObject().ownerId !== this.getCurrentUserId()) {
			throw new MeetingError({
				message: MeetingStatusMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}

		const updatedEntity = MeetingEntity.initialize({
			host: payload.host ?? meeting.toObject().host,
			id,
			instanceId: payload.instanceId ?? meeting.toObject().instanceId,
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
