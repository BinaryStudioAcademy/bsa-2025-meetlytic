import { createPdf } from "~/libs/helpers/helpers.js";
import { type Service } from "~/libs/types/types.js";

import {
	HTTPCode,
	MeetingTranscriptionErrorMessage,
} from "./libs/enums/enums.js";
import { MeetingTranscriptionError } from "./libs/exceptions/exceptions.js";
import { getMeetingHtmlTemplate } from "./libs/templates/get-meeting-html-template.js";
import {
	type CreatePdfOptions,
	type MeetingTranscriptionGetAllResponseDto,
	type MeetingTranscriptionRequestDto,
	type MeetingTranscriptionResponseDto,
	type MeetingUpdateTranscriptionRequestDto,
} from "./libs/types/types.js";
import { MeetingTranscriptionEntity } from "./meeting-transcription.entity.js";
import { type MeetingTranscriptionRepository } from "./meeting-transcription.repository.js";

type Constructor = {
	meetingTranscriptionRepository: MeetingTranscriptionRepository;
};

class MeetingTranscriptionService
	implements Service<MeetingTranscriptionResponseDto>
{
	private meetingTranscriptionRepository: MeetingTranscriptionRepository;

	public constructor({ meetingTranscriptionRepository }: Constructor) {
		this.meetingTranscriptionRepository = meetingTranscriptionRepository;
	}

	public async create(
		payload: MeetingTranscriptionRequestDto,
	): Promise<MeetingTranscriptionResponseDto> {
		const meetingTranscription =
			MeetingTranscriptionEntity.initializeNew(payload);
		const createdTranscription =
			await this.meetingTranscriptionRepository.create(meetingTranscription);

		return createdTranscription.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const existingTranscription =
			await this.meetingTranscriptionRepository.find(id);

		if (!existingTranscription) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const isTranscriptionDeleted =
			await this.meetingTranscriptionRepository.delete(id);

		if (!isTranscriptionDeleted) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.DELETE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return isTranscriptionDeleted;
	}

	public async exportToPDF(options: CreatePdfOptions): Promise<Buffer> {
		const html: string = getMeetingHtmlTemplate(options);

		return await createPdf(html);
	}

	public async find(id: number): Promise<MeetingTranscriptionResponseDto> {
		const transcription = await this.meetingTranscriptionRepository.find(id);

		if (!transcription) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return transcription.toObject();
	}

	public async findAll(
		filter?: Partial<Record<string, unknown>>,
	): Promise<MeetingTranscriptionGetAllResponseDto> {
		const transcriptions =
			await this.meetingTranscriptionRepository.findAll(filter);

		return {
			items: transcriptions.map((transcription) => transcription.toObject()),
		};
	}

	public async getByMeetingId(
		meetingId: number,
	): Promise<MeetingTranscriptionGetAllResponseDto> {
		const transcriptions =
			await this.meetingTranscriptionRepository.findByMeetingId(meetingId);

		return {
			items: transcriptions.map((transcription) => transcription.toObject()),
		};
	}

	public async update(
		id: number,
		payload: MeetingUpdateTranscriptionRequestDto,
	): Promise<MeetingTranscriptionResponseDto> {
		const transcription = await this.meetingTranscriptionRepository.find(id);

		if (!transcription) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const updatedTranscription =
			await this.meetingTranscriptionRepository.update(id, payload);

		if (!updatedTranscription) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updatedTranscription.toObject();
	}
}

export { MeetingTranscriptionService };
