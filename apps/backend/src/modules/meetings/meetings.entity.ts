import { type Entity, type ValueOf } from "~/libs/types/types.js";

import { type MeetingHost, MeetingStatus } from "./libs/enums/enums.js";

class MeetingEntity implements Entity {
	private actionItems: null | string;

	private audioFileId: null | number;

	private createdAt: null | string;

	private host: ValueOf<typeof MeetingHost>;

	private id: null | number;

	private instanceId: null | string;

	private meetingId: string;

	private meetingPassword: null | string;

	private ownerId: number;

	private status!: ValueOf<typeof MeetingStatus>;

	private summary: null | string;

	private constructor({
		actionItems,
		audioFileId,
		createdAt,
		host,
		id,
		instanceId,
		meetingId,
		meetingPassword,
		ownerId,
		status,
		summary,
	}: {
		actionItems: null | string;
		audioFileId: null | number;
		createdAt: null | string;
		host: ValueOf<typeof MeetingHost>;
		id: null | number;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
	}) {
		this.actionItems = actionItems;
		this.audioFileId = audioFileId;
		this.createdAt = createdAt;
		this.id = id;
		this.host = host;
		this.instanceId = instanceId;
		this.meetingId = meetingId;
		this.meetingPassword = meetingPassword;
		this.ownerId = ownerId;
		this.status = status;
		this.summary = summary;
	}

	public static initialize({
		actionItems,
		audioFileId,
		createdAt,
		host,
		id,
		instanceId,
		meetingId,
		meetingPassword,
		ownerId,
		status,
		summary,
	}: {
		actionItems: null | string;
		audioFileId: null | number;
		createdAt: null | string;
		host: ValueOf<typeof MeetingHost>;
		id: number;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
	}): MeetingEntity {
		return new MeetingEntity({
			actionItems,
			audioFileId,
			createdAt,
			host,
			id,
			instanceId,
			meetingId,
			meetingPassword,
			ownerId,
			status,
			summary,
		});
	}

	public static initializeNew({
		host,
		instanceId,
		meetingId,
		meetingPassword,
		ownerId,
	}: {
		host: ValueOf<typeof MeetingHost>;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
	}): MeetingEntity {
		return new MeetingEntity({
			actionItems: null,
			audioFileId: null,
			createdAt: null,
			host,
			id: null,
			instanceId,
			meetingId,
			meetingPassword,
			ownerId,
			status: MeetingStatus.STARTED,
			summary: null,
		});
	}

	public toClientObject(): {
		audioFileId: null | number;
		createdAt: string;
		host: ValueOf<typeof MeetingHost>;
		id: number;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	} {
		return {
			audioFileId: this.audioFileId,
			createdAt: this.createdAt as string,
			host: this.host,
			id: this.id as number,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
		};
	}

	public toDetailedObject(): {
		actionItems: null | string;
		audioFileId: null | number;
		createdAt: string;
		host: ValueOf<typeof MeetingHost>;
		id: number;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
	} {
		return {
			actionItems: this.actionItems as string,
			audioFileId: this.audioFileId,
			createdAt: this.createdAt as string,
			host: this.host,
			id: this.id as number,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
			summary: this.summary as string,
		};
	}

	public toNewObject(): {
		host: ValueOf<typeof MeetingHost>;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	} {
		return {
			host: this.host,
			instanceId: this.instanceId,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
		};
	}

	public toObject(): {
		audioFileId: null | number;
		createdAt: string;
		host: ValueOf<typeof MeetingHost>;
		id: number;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	} {
		return {
			audioFileId: this.audioFileId,
			createdAt: this.createdAt as string,
			host: this.host,
			id: this.id as number,
			instanceId: this.instanceId,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
		};
	}
}

export { MeetingEntity };
