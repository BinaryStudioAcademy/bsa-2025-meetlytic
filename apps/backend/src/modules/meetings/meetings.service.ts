import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants.js";
import { APIPath } from "~/libs/enums/enums.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import {
	type CloudFormation,
	type CreateStack,
} from "~/libs/modules/cloud-formation/cloud-formation.js";
import template from "~/libs/modules/cloud-formation/libs/templates/ec2-instance-template.json" with { type: "json" };
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	type BaseToken,
	type SharedJwtPayload,
} from "~/libs/modules/token/token.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingErrorMessage, MeetingStatus } from "./libs/enums/enums.js";
import { MeetingError } from "./libs/exceptions/exceptions.js";
import { extractZoomMeetingId } from "./libs/helpers/helpers.js";
import {
	type MeetingAttachAudioRequestDto,
	type MeetingCreateRequestDto,
	type MeetingDetailedResponseDto,
	type MeetingGetAllResponseDto,
	type MeetingGetPublicUrlResponseDto,
	type MeetingResponseDto,
	type MeetingTranscriptionGetAllResponseDto,
	type MeetingTranscriptionRequestDto,
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
	sharedJwt: BaseToken<SharedJwtPayload>;
};

class MeetingService implements Service<MeetingResponseDto> {
	private cloudFormation: CloudFormation;
	private meetingRepository: MeetingRepository;
	private meetingTranscriptionService: MeetingTranscriptionService;
	private sharedJwt: BaseToken<SharedJwtPayload>;

	public constructor({
		cloudFormation,
		meetingRepository,
		meetingTranscriptionService,
		sharedJwt,
	}: Constructor) {
		this.cloudFormation = cloudFormation;
		this.meetingRepository = meetingRepository;
		this.meetingTranscriptionService = meetingTranscriptionService;
		this.sharedJwt = sharedJwt;
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

	public async attachAudioFile(
		id: number,
		payload: MeetingAttachAudioRequestDto,
	): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		if (meeting.toObject().audioFileId) {
			throw new MeetingError({
				message: MeetingErrorMessage.AUDIO_FILE_ALREADY_ATTACHED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const updated = await this.meetingRepository.attachAudioFile(
			id,
			payload.fileId,
		);

		if (!updated) {
			throw new MeetingError({
				message: MeetingErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updated.toClientObject();
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

		const existing = await this.meetingRepository.findAll({
			meetingId: meetingId,
			status: MeetingStatus.STARTED,
		});

		if (existing.length > EMPTY_ARRAY_LENGTH) {
			throw new MeetingError({
				message: MeetingErrorMessage.DUPLICATED_MEETING,
				status: HTTPCode.CONFLICT,
			});
		}

		const meeting = MeetingEntity.initializeNew({
			host: payload.host,
			instanceId: null,
			meetingId,
			meetingPassword: payload.meetingPassword ?? null,
			ownerId: payload.ownerId,
		});

		let newMeeting;

		try {
			newMeeting = await this.meetingRepository.create(meeting);
		} catch {
			throw new MeetingError({
				message: MeetingErrorMessage.DUPLICATED_MEETING,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const { id, meetingPassword } = newMeeting.toObject();

		if (!id) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_FAILED_TO_CREATE,
				status: HTTPCode.NOT_FOUND,
			});
		}

		try {
			const instance = await this.createInstance({
				id,
				meetingLink,
				meetingPassword,
			});

			return instance;
		} catch {
			await this.meetingRepository.delete(id);

			throw new MeetingError({
				message: MeetingErrorMessage.JOIN_THE_MEETING,
				status: HTTPCode.NOT_FOUND,
			});
		}
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

	public async endMeeting(id: number): Promise<MeetingDetailedResponseDto> {
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

		return meeting.toDetailedObject();
	}

	public async find(id: number): Promise<MeetingDetailedResponseDto> {
		const meeting = await this.meetingRepository.find(id);

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.MEETING_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return meeting.toDetailedObject();
	}

	public async findAll(
		filter?: Partial<MeetingResponseDto>,
	): Promise<MeetingGetAllResponseDto> {
		const ownerId = filter?.ownerId as number;

		const meetings = await this.meetingRepository.findAllByOwnerId(ownerId);

		return { items: meetings.map((meeting) => meeting.toObject()) };
	}

	public async findBySignedUrl(
		id: number,
		token: string,
	): Promise<MeetingResponseDto> {
		try {
			const { payload } = await this.sharedJwt.verify(token);

			if (id !== payload.meetingId) {
				throw new AuthError();
			}
		} catch {
			throw new AuthError();
		}

		return await this.find(id);
	}

	public async getPublicUrl(
		id: number,
	): Promise<MeetingGetPublicUrlResponseDto> {
		const meeting = await this.find(id);
		const token = await this.sharedJwt.sign({ meetingId: meeting.id });

		return {
			publicUrl: `${APIPath.PUBLIC_MEETINGS}/${String(id)}?token=${token}`,
		};
	}

	public async getTranscriptionsByMeetingId(
		id: number,
	): Promise<MeetingTranscriptionGetAllResponseDto> {
		return await this.meetingTranscriptionService.getByMeetingId(id);
	}

	public async saveChunk({
		chunkText,
		meetingId,
	}: MeetingTranscriptionRequestDto): Promise<MeetingTranscriptionResponseDto> {
		const transcription = await this.meetingTranscriptionService.create({
			chunkText,
			meetingId,
		});

		return transcription;
	}

	public async stopRecording(id: number): Promise<void> {
		// TODO:
		// 1. emit a message for the bot (bot stops audio recording, transcribes full audio, gets summary and action points)
		// 2. move endMeeting(id) call to the websocket event handler
		await this.endMeeting(id);
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
			actionItems: meetingEntity.toDetailedObject().actionItems,
			audioFile: meetingEntity.toDetailedObject().audioFile,
			audioFileId: meetingEntity.toDetailedObject().audioFileId,
			createdAt: meetingEntity.toObject().createdAt,
			host: payload.host,
			id,
			instanceId: meetingEntity.toObject().instanceId,
			meetingId: meetingEntity.toObject().meetingId,
			meetingPassword: meetingEntity.toObject().meetingPassword,
			ownerId: meetingEntity.toObject().ownerId,
			status: payload.status,
			summary: meetingEntity.toDetailedObject().summary,
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

		return updatedMeeting.toClientObject();
	}
}

export { MeetingService };
