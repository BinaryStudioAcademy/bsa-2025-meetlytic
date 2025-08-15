import { type Service } from "~/libs/types/types.js";

import { HTTPCode, MeetingAudioErrorMessage } from "./libs/enums/enums.js";
import { MeetingAudioError } from "./libs/exceptions/exceptions.js";
import {
	type MeetingAudioGetAllResponseDto,
	type MeetingAudioRequestDto,
	type MeetingAudioResponseDto,
	type MeetingUpdateAudioRequestDto,
} from "./libs/types/types.js";
import { MeetingAudioEntity } from "./meeting-audio.entity.js";
import { type MeetingAudioRepository } from "./meeting-audio.repository.js";

type Constructor = {
	meetingAudioRepository: MeetingAudioRepository;
};

class MeetingAudioService implements Service<MeetingAudioResponseDto> {
	private meetingAudioRepository: MeetingAudioRepository;

	public constructor({ meetingAudioRepository }: Constructor) {
		this.meetingAudioRepository = meetingAudioRepository;
	}

	public async create(
		payload: MeetingAudioRequestDto,
	): Promise<MeetingAudioResponseDto> {
		const entity = MeetingAudioEntity.initializeNew(payload);
		const created = await this.meetingAudioRepository.create(entity);

		return created.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const existing = await this.meetingAudioRepository.find(id);

		if (!existing) {
			throw new MeetingAudioError({
				message: MeetingAudioErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const ok = await this.meetingAudioRepository.delete(id);

		if (!ok) {
			throw new MeetingAudioError({
				message: MeetingAudioErrorMessage.DELETE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return ok;
	}

	public async find(id: number): Promise<MeetingAudioResponseDto> {
		const row = await this.meetingAudioRepository.find(id);

		if (!row) {
			throw new MeetingAudioError({
				message: MeetingAudioErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return row.toObject();
	}

	public async findAll(
		filter?: Partial<Record<string, unknown>>,
	): Promise<MeetingAudioGetAllResponseDto> {
		const items = await this.meetingAudioRepository.findAll(filter);

		return { items: items.map((item) => item.toObject()) };
	}

	public async getByMeetingId(
		meetingId: number,
	): Promise<MeetingAudioResponseDto[]> {
		const items = await this.meetingAudioRepository.findByMeetingId(meetingId);

		return items.map((item) => item.toObject());
	}

	public async update(
		id: number,
		payload: MeetingUpdateAudioRequestDto,
	): Promise<MeetingAudioResponseDto> {
		const existing = await this.meetingAudioRepository.find(id);

		if (!existing) {
			throw new MeetingAudioError({
				message: MeetingAudioErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const updated = await this.meetingAudioRepository.update(id, payload);

		if (!updated) {
			throw new MeetingAudioError({
				message: MeetingAudioErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updated.toObject();
	}
}

export { MeetingAudioService };
