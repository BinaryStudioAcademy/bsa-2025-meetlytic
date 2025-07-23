import { type Entity } from "~/libs/types/types.js";

import { type MeetingHostValue } from "./libs/types/types.js";

class MeetingEntity implements Entity {
	private host: MeetingHostValue;

	private id: null | number;

	private instanceId: null | string;

	private ownerId: number;

	private constructor({
		host,
		id,
		instanceId,
		ownerId,
	}: {
		host: MeetingHostValue;
		id: null | number;
		instanceId: null | string;
		ownerId: number;
	}) {
		this.id = id;
		this.host = host;
		this.instanceId = instanceId;
		this.ownerId = ownerId;
	}

	public static initialize({
		host,
		id,
		instanceId,
		ownerId,
	}: {
		host: MeetingHostValue;
		id: null | number;
		instanceId: null | string;
		ownerId: number;
	}): MeetingEntity {
		return new MeetingEntity({
			host,
			id,
			instanceId,
			ownerId,
		});
	}

	public static initializeNew({
		host,
		instanceId,
		ownerId,
	}: {
		host: MeetingHostValue;
		instanceId: null | string;
		ownerId: number;
	}): MeetingEntity {
		return new MeetingEntity({
			host,
			id: null,
			instanceId,
			ownerId,
		});
	}

	public toNewObject(): {
		host: MeetingHostValue;
		instanceId: null | string;
		ownerId: number;
	} {
		return {
			host: this.host,
			instanceId: this.instanceId,
			ownerId: this.ownerId,
		};
	}

	public toObject(): {
		host: MeetingHostValue;
		id: null | number;
		instanceId: null | string;
		ownerId: number;
	} {
		return {
			host: this.host,
			id: this.id,
			instanceId: this.instanceId,
			ownerId: this.ownerId,
		};
	}
}

export { MeetingEntity };
