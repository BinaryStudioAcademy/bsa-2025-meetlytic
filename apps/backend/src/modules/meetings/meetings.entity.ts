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

	private meetingTitle: null | string;

	private ownerId: number;

	private status!: ValueOf<typeof MeetingStatus>;

	private summary: null | string;

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
		meetingTitle,
		ownerId,
		status,
		summary,
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
		meetingTitle: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
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
		this.meetingTitle = meetingTitle;
		this.ownerId = ownerId;
		this.status = status;
		this.summary = summary;
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
		meetingTitle,
		ownerId,
		status,
		summary,
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
		meetingTitle: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
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
			meetingTitle,
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
		meetingTitle,
		ownerId,
	}: {
		host: ValueOf<typeof MeetingHost>;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		meetingTitle: null | string;
		ownerId: number;
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
			meetingTitle,
			ownerId,
			status: MeetingStatus.STARTED,
			summary: null,
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
		meetingTitle: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	} {
		return {
			audioFile: this.audioFile,
			audioFileId: this.audioFileId,
			createdAt: this.createdAt as string,
			host: this.host,
			id: this.id as number,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			meetingTitle: this.meetingTitle,
			ownerId: this.ownerId,
			status: this.status,
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
		meetingTitle: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
		summary: null | string;
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
			meetingTitle: this.meetingTitle,
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
		meetingTitle: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	} {
		return {
			host: this.host,
			instanceId: this.instanceId,
			meetingId: this.meetingId,
			meetingPassword: this.meetingPassword,
			meetingTitle: this.meetingTitle,
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
		meetingTitle: null | string;
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
			meetingTitle: this.meetingTitle,
			ownerId: this.ownerId,
			status: this.status,
		};
	}
}

export { MeetingEntity };
