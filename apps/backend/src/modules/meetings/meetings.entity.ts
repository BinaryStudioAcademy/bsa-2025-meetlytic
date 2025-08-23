import { type Entity, type ValueOf } from "~/libs/types/types.js";

import { type MeetingHost, MeetingStatus } from "./libs/enums/enums.js";
import { type FilePublicDto } from "./libs/types/types.js";

class MeetingEntity implements Entity {
	private actionItems: null | string;

	private audioFile: FilePublicDto | null;

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

	private title: null | string;

	private constructor({
		actionItems,
		audioFile,
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
		title,
	}: {
		actionItems: null | string;
		audioFile: FilePublicDto | null;
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
		title: null | string;
	}) {
		this.actionItems = actionItems;
		this.audioFile = audioFile;
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
		this.title = title;
	}

	public static initialize({
		actionItems,
		audioFile,
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
		title,
	}: {
		actionItems: null | string;
		audioFile: FilePublicDto | null;
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
		title: null | string;
	}): MeetingEntity {
		return new MeetingEntity({
			actionItems,
			audioFile,
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
			title,
		});
	}

	public static initializeNew({
		host,
		instanceId,
		meetingId,
		meetingPassword,
		ownerId,
		title,
	}: {
		host: ValueOf<typeof MeetingHost>;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		title: null | string;
	}): MeetingEntity {
		return new MeetingEntity({
			actionItems: null,
			audioFile: null,
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
			title,
		});
	}

	public toClientObject(): {
		audioFile: FilePublicDto | null;
		audioFileId: null | number;
		createdAt: string;
		host: ValueOf<typeof MeetingHost>;
		id: number;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		title: null | string;
	} {
		return {
			audioFile: this.audioFile,
			audioFileId: this.audioFileId,
			createdAt: this.createdAt as string,
			host: this.host,
			id: this.id as number,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
			title: this.title,
		};
	}

	public toDetailedObject(): {
		actionItems: null | string;
		audioFile: FilePublicDto | null;
		audioFileId: null | number;
		createdAt: string;
		host: ValueOf<typeof MeetingHost>;
		id: number;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
		title: null | string;
	} {
		return {
			actionItems: this.actionItems as string,
			audioFile: this.audioFile,
			audioFileId: this.audioFileId,
			createdAt: this.createdAt as string,
			host: this.host,
			id: this.id as number,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
			summary: this.summary as string,
			title: this.title,
		};
	}

	public toNewObject(): {
		host: ValueOf<typeof MeetingHost>;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		title: null | string;
	} {
		return {
			host: this.host,
			instanceId: this.instanceId,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			ownerId: this.ownerId,
			status: this.status,
			title: this.title,
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
		title: null | string;
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
			title: this.title,
		};
	}
}

export { MeetingEntity };
