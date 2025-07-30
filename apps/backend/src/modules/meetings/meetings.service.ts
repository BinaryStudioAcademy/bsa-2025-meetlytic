import { type CloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.js";
import template from "~/libs/modules/cloud-formation/libs/templates/ec2-instance-template.json" with { type: "json" };
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingErrorMessage, MeetingStatus } from "./libs/enums/enums.js";
import { MeetingError } from "./libs/exceptions/exceptions.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
	type MeetingUpdateRequestDto,
} from "./libs/types/types.js";
import { MeetingEntity } from "./meetings.entity.js";
import { type MeetingRepository } from "./meetings.repository.js";

type Constructor = {
	cloudFormation: CloudFormation;
	meetingRepository: MeetingRepository;
};

class MeetingService implements Service<MeetingResponseDto> {
	private cloudFormation: CloudFormation;
	private meetingRepository: MeetingRepository;

	public constructor({ cloudFormation, meetingRepository }: Constructor) {
		this.cloudFormation = cloudFormation;
		this.meetingRepository = meetingRepository;
	}

	private async createInstance(id: number): Promise<MeetingResponseDto> {
		const instanceId = await this.cloudFormation.create({
			id,
			template: JSON.stringify(template),
		});
		const meeting = await this.meetingRepository.update(id, {
			instanceId,
		});

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.UPDATE_FAILED,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return meeting.toObject();
	}

	public async create(
		payload: MeetingCreateRequestDto,
	): Promise<MeetingResponseDto> {
		const meeting = MeetingEntity.initializeNew({
			host: payload.host,
			instanceId: payload.instanceId ?? null,
			ownerId: (payload as MeetingCreateRequestDto & { ownerId: number })
				.ownerId,
		});

		const newMeeting = await this.meetingRepository.create(meeting);
		const { id } = newMeeting.toObject();

		if (!id) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_FAILED_TO_CREATE,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return await this.createInstance(id);
	}

	public async delete(id: number): Promise<boolean> {
		const meetingToDelete = await this.meetingRepository.find(id);

		if (!meetingToDelete) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const isDeleted = await this.meetingRepository.delete(id);

		if (!isDeleted) {
			throw new MeetingError({
				message: MeetingErrorMessage.DELETE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return isDeleted;
	}
	public async endMeeting(id: number): Promise<MeetingResponseDto> {
		await this.cloudFormation.delete(id);
		const meeting = await this.meetingRepository.update(id, {
			instanceId: null,
			status: MeetingStatus.ENDED,
		});

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return meeting.toObject();
	}

	public async find(id: number): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return meeting.toObject();
	}

	public async findAll(
		filter?: Partial<MeetingResponseDto>,
	): Promise<MeetingGetAllResponseDto> {
		const ownerId = filter?.ownerId as number;

		const meetings = await this.meetingRepository.findAllByOwnerId(ownerId);

		return { items: meetings.map((meeting) => meeting.toObject()) };
	}

	public async update(
		id: number,
		payload: MeetingUpdateRequestDto,
	): Promise<MeetingResponseDto> {
		const meetingEntity = await this.meetingRepository.find(id);

		if (!meetingEntity) {
			throw new MeetingError({
				message: MeetingErrorMessage.CANNOT_UPDATE_NON_EXISTENT,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const meeting = MeetingEntity.initialize({
			host: payload.host ?? meetingEntity.toObject().host,
			id,
			instanceId: meetingEntity.toObject().instanceId,
			ownerId: meetingEntity.toObject().ownerId,
			status: payload.status ?? meetingEntity.toObject().status,
		});

		const updatedMeeting = await this.meetingRepository.update(
			id,
			meeting.toNewObject(),
		);

		if (!updatedMeeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updatedMeeting.toObject();
	}
}

export { MeetingService };
