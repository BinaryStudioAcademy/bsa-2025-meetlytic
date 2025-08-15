import { type Entity } from "~/libs/types/types.js";

import {
	type MeetingAudioRequestDto,
	type MeetingAudioResponseDto,
} from "./libs/types/types.js";

type Constructor = {
	createdAt: null | string;
	fileName: string;
	fileUrl: string;
	id: null | number;
	meetingId: number;
	updatedAt: null | string;
};

class MeetingAudioEntity implements Entity {
	private createdAt: null | string;
	private fileName: string;
	private fileUrl: string;
	private id: null | number;
	private meetingId: number;
	private updatedAt: null | string;

	private constructor(c: Constructor) {
		this.id = c.id;
		this.meetingId = c.meetingId;
		this.fileName = c.fileName;
		this.fileUrl = c.fileUrl;
		this.createdAt = c.createdAt;
		this.updatedAt = c.updatedAt;
	}

	public static initialize(dto: MeetingAudioResponseDto): MeetingAudioEntity {
		return new MeetingAudioEntity({
			createdAt: dto.createdAt,
			fileName: dto.fileName,
			fileUrl: dto.fileUrl,
			id: dto.id,
			meetingId: dto.meetingId,
			updatedAt: dto.updatedAt,
		});
	}

	public static initializeNew(dto: MeetingAudioRequestDto): MeetingAudioEntity {
		return new MeetingAudioEntity({
			createdAt: null,
			fileName: dto.fileName,
			fileUrl: dto.fileUrl,
			id: null,
			meetingId: dto.meetingId,
			updatedAt: null,
		});
	}

	public toNewObject(): MeetingAudioRequestDto {
		return {
			fileName: this.fileName,
			fileUrl: this.fileUrl,
			meetingId: this.meetingId,
		};
	}

	public toObject(): MeetingAudioResponseDto {
		return {
			createdAt: this.createdAt as string,
			fileName: this.fileName,
			fileUrl: this.fileUrl,
			id: this.id as number,
			meetingId: this.meetingId,
			updatedAt: this.updatedAt as string,
		};
	}
}

export { MeetingAudioEntity };
