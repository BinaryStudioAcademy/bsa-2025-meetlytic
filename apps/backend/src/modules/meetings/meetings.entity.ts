import { type Entity, type ValueOf } from "~/libs/types/types.js";

import { type MeetingHost, MeetingStatus } from "./libs/enums/enums.js";

class MeetingEntity implements Entity {
	private host: ValueOf<typeof MeetingHost>;

	private id: null | number;

	private instanceId: null | string;

	private meetingId: string;

	private meetingPassword: null | string;

	private ownerId: number;

	private status!: ValueOf<typeof MeetingStatus>;

	private constructor({
		host,
		id,
		instanceId,
		meetingId,
		meetingPassword,
		ownerId,
		status,
	}: {
		host: ValueOf<typeof MeetingHost>;
		id: null | number;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	}) {
		this.id = id;
		this.host = host;
		this.instanceId = instanceId;
		this.meetingId = meetingId;
		this.meetingPassword = meetingPassword;
		this.ownerId = ownerId;
		this.status = status;
	}

	public static initialize({
		host,
		id,
		instanceId,
		meetingId,
		meetingPassword,
		ownerId,
		status,
	}: {
		host: ValueOf<typeof MeetingHost>;
		id: number;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	}): MeetingEntity {
		return new MeetingEntity({
			host,
			id,
			instanceId,
			meetingId,
			meetingPassword,
			ownerId,
			status,
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
			host,
			id: null,
			instanceId,
			meetingId,
			meetingPassword,
			ownerId,
			status: MeetingStatus.STARTED,
		});
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
		host: ValueOf<typeof MeetingHost>;
		id: number;
		instanceId: null | string;
		meetingId: string;
		meetingPassword: null | string;
		ownerId: number;
		status: ValueOf<typeof MeetingStatus>;
	} {
		return {
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
