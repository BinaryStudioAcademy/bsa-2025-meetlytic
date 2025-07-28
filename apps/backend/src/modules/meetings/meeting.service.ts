import { type CloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.module.js";
import template from "~/libs/modules/cloud-formation/libs/templates/ec2-instance-template.json" with { type: "json" };

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingErrorMessage } from "./libs/enums/enums.js";
import { MeetingError } from "./libs/exceptions/exceptions.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
} from "./libs/types/types.js";
import { MeetingEntity } from "./meeting.entity.js";
import { type MeetingRepository } from "./meeting.repository.js";

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

		const instanceId = await this.cloudFormation.create({
			id,
			template: JSON.stringify(template),
		});
		const updated = await this.meetingRepository.update(id, {
			instanceId,
		});
		if (!updated) {
			throw new MeetingError({
				message: MeetingErrorMessage.UPDATE_FAILED,
				status: HTTPCode.NOT_FOUND,
			});
		}
		return updated.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const meetingToDelete = await this.meetingRepository.find(id);

		if (!meetingToDelete) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return await this.meetingRepository.delete(id);
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

	public async findAll(): Promise<MeetingGetAllResponseDto> {
		const allMeetings = await this.meetingRepository.findAll();

		return {
			items: allMeetings.map((m) => m.toObject()),
		};
	}

	public async update(
		id: number,
		payload: Partial<MeetingCreateRequestDto>,
	): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.CANNOT_UPDATE_NON_EXISTENT,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const updatedEntity = MeetingEntity.initialize({
			host: (payload as MeetingCreateRequestDto).host,
			id,
			instanceId: meeting.toObject().instanceId,
			ownerId: meeting.toObject().ownerId,
		});

		const updated = await this.meetingRepository.update(
			id,
			updatedEntity.toNewObject(),
		);

		if (!updated) {
			throw new MeetingError({
				message: MeetingErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updated.toObject();
	}
}

export { MeetingService };
