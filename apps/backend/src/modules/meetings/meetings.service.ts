import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { MeetingErrorMessage } from "./libs/enums/enums.js";
import { MeetingError } from "./libs/exceptions/exceptions.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
	type MeetingUpdateRequestDto,
} from "./libs/types/types.js";
import { MeetingEntity } from "./meetings.entity.js";
import { type MeetingRepository } from "./meetings.repository.js";

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
			ownerId: (payload as MeetingCreateRequestDto & { ownerId: number })
				.ownerId,
		});

		const newMeeting = await this.meetingRepository.create(meeting);

		return newMeeting.toObject();
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

	public async findAll(
		filter?: Partial<MeetingResponseDto>,
	): Promise<MeetingGetAllResponseDto> {
		const ownerId = filter?.ownerId;

		if (!ownerId) {
			throw new MeetingError({
				message: MeetingErrorMessage.FORBIDDEN,
				status: HTTPCode.FORBIDDEN,
			});
		}

		const meetings = await this.meetingRepository.findAllByOwnerId(ownerId);

		return { items: meetings.map((m) => m.toObject()) };
	}

	public async update(
		id: number,
		payload: Partial<MeetingUpdateRequestDto>,
	): Promise<MeetingResponseDto> {
		const meeting = await this.meetingRepository.find(id);

		if (!meeting) {
			throw new MeetingError({
				message: MeetingErrorMessage.CANNOT_UPDATE_NON_EXISTENT,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const newMeeting = MeetingEntity.initialize({
			host: payload.host ?? meeting.toObject().host,
			id,
			instanceId: meeting.toObject().instanceId,
			ownerId: meeting.toObject().ownerId,
			status: payload.status ?? meeting.toObject().status,
		});

		const updatedMeeting = await this.meetingRepository.update(
			id,
			newMeeting.toNewObject(),
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
