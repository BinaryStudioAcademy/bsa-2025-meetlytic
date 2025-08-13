import {
	type CloudFormation,
	type CreateStack,
} from "~/libs/modules/cloud-formation/cloud-formation.js";
import template from "~/libs/modules/cloud-formation/libs/templates/ec2-instance-template.json" with { type: "json" };
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingErrorMessage, MeetingStatus } from "./libs/enums/enums.js";
import { MeetingError } from "./libs/exceptions/exceptions.js";
import { extractZoomMeetingId } from "./libs/helpers/helpers.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
	type MeetingTranscriptionResponseDto,
	type MeetingUpdateRequestDto,
} from "./libs/types/types.js";
import { type MeetingTranscriptionService } from "./meeting-transcription.service.js";
import { MeetingEntity } from "./meetings.entity.js";
import { type MeetingRepository } from "./meetings.repository.js";

type Constructor = {
	cloudFormation: CloudFormation;
	meetingRepository: MeetingRepository;
	meetingTranscriptionService: MeetingTranscriptionService;
};

class MeetingService implements Service<MeetingResponseDto> {
	private cloudFormation: CloudFormation;
	private meetingRepository: MeetingRepository;
	private meetingTranscriptionService: MeetingTranscriptionService;

	public constructor({
		cloudFormation,
		meetingRepository,
		meetingTranscriptionService,
	}: Constructor) {
		this.cloudFormation = cloudFormation;
		this.meetingRepository = meetingRepository;
		this.meetingTranscriptionService = meetingTranscriptionService;
	}

	private async createInstance(
		payload: Omit<CreateStack, "template">,
	): Promise<MeetingResponseDto> {
		const instanceId = await this.cloudFormation.create({
			...payload,
			template: JSON.stringify(template),
		});
		const meeting = await this.meetingRepository.update(payload.id, {
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
		payload: MeetingCreateRequestDto & { ownerId: number },
	): Promise<MeetingResponseDto> {
		const { meetingLink } = payload;
		const meetingId = extractZoomMeetingId(meetingLink);

		if (!meetingId) {
			throw new MeetingError({
				message: MeetingErrorMessage.INVALID_MEETING_LINK,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const meeting = MeetingEntity.initializeNew({
			host: payload.host,
			instanceId: null,
			meetingId,
			meetingPassword: payload.meetingPassword ?? null,
			ownerId: payload.ownerId,
		});

		const newMeeting = await this.meetingRepository.create(meeting);
		const { id, meetingPassword } = newMeeting.toObject();

		if (!id) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_FAILED_TO_CREATE,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return await this.createInstance({ id, meetingLink, meetingPassword });
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
	public async saveChunk({
		chunkText,
		zoomMeetingId: meetingId,
	}: {
		chunkText: string;
		zoomMeetingId: number;
	}): Promise<MeetingTranscriptionResponseDto> {
		const transcription = await this.meetingTranscriptionService.create({
			chunkText,
			meetingId,
		});

		return transcription;
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
			createdAt: meetingEntity.toObject().createdAt,
			host: payload.host,
			id,
			instanceId: meetingEntity.toObject().instanceId,
			meetingId: meetingEntity.toObject().meetingId,
			meetingPassword: meetingEntity.toObject().meetingPassword,
			ownerId: meetingEntity.toObject().ownerId,
			status: payload.status,
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
