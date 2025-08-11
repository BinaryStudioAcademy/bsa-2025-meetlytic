import { type Service } from "~/libs/types/types.js";

import {
	HTTPCode,
	MeetingTranscriptionErrorMessage,
} from "./libs/enums/enums.js";
import { MeetingTranscriptionError } from "./libs/exceptions/exceptions.js";
import {
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
		const newEntity = MeetingTranscriptionEntity.initializeNew(payload);
		const created = await this.meetingTranscriptionRepository.create(newEntity);

		return created.toObject();
	}
	public async delete(id: number): Promise<boolean> {
		const existing = await this.meetingTranscriptionRepository.find(id);

		if (!existing) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const deleted = await this.meetingTranscriptionRepository.delete(id);

		if (!deleted) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.DELETE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return deleted;
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
		const entities = await this.meetingTranscriptionRepository.findAll(filter);

		return {
			items: entities.map((entity) => entity.toObject()),
		};
	}

	public async update(
		id: number,
		payload: MeetingUpdateTranscriptionRequestDto,
	): Promise<MeetingTranscriptionResponseDto> {
		const existing = await this.meetingTranscriptionRepository.find(id);

		if (!existing) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const updated = await this.meetingTranscriptionRepository.update(
			id,
			payload,
		);

		if (!updated) {
			throw new MeetingTranscriptionError({
				message: MeetingTranscriptionErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updated.toObject();
	}
}

export { MeetingTranscriptionService };
