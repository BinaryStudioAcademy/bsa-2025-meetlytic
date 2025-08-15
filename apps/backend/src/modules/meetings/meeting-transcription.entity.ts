import { type Entity } from "~/libs/types/types.js";

import {
	type MeetingTranscriptionRequestDto,
	type MeetingTranscriptionResponseDto,
} from "./libs/types/types.js";

type Constructor = {
	chunkText: string;
	createdAt: null | string;
	id: null | number;
	meetingId: number;
	updatedAt: null | string;
};

class MeetingTranscriptionEntity implements Entity {
	private chunkText: string;
	private createdAt: null | string;
	private id: null | number;
	private meetingId: number;
	private updatedAt: null | string;

	private constructor({
		chunkText,
		createdAt,
		id,
		meetingId,
		updatedAt,
	}: Constructor) {
		this.chunkText = chunkText;
		this.createdAt = createdAt;
		this.id = id;
		this.meetingId = meetingId;
		this.updatedAt = updatedAt;
	}

	public static initialize({
		chunkText,
		createdAt,
		id,
		meetingId,
		updatedAt,
	}: MeetingTranscriptionResponseDto): MeetingTranscriptionEntity {
		return new MeetingTranscriptionEntity({
			chunkText,
			createdAt,
			id,
			meetingId,
			updatedAt,
		});
	}

	public static initializeNew({
		chunkText,
		meetingId,
	}: MeetingTranscriptionRequestDto): MeetingTranscriptionEntity {
		return new MeetingTranscriptionEntity({
			chunkText,
			createdAt: null,
			id: null,
			meetingId,
			updatedAt: null,
		});
	}

	public toNewObject(): MeetingTranscriptionRequestDto {
		return {
			chunkText: this.chunkText,
			meetingId: this.meetingId,
		};
	}

	public toObject(): MeetingTranscriptionResponseDto {
		return {
			chunkText: this.chunkText,
			createdAt: this.createdAt,
			id: this.id,
			meetingId: this.meetingId,
			updatedAt: this.updatedAt,
		} as MeetingTranscriptionResponseDto;
	}
}

export { MeetingTranscriptionEntity };
