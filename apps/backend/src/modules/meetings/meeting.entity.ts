import { type Entity } from "~/libs/types/types.js";
import { ValueOf } from "~/libs/types/types.js";

import { MeetingHost } from "./libs/enums/enums.js";

class MeetingEntity implements Entity {
	private host: ValueOf<typeof MeetingHost>;

	private id: null | number;

	private instanceId: null | string;

	private ownerId: number;

	private constructor({
		host,
		id,
		instanceId,
		ownerId,
	}: {
		host: ValueOf<typeof MeetingHost>;
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
		host: ValueOf<typeof MeetingHost>;
		id: number;
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
		host: ValueOf<typeof MeetingHost>;
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
		host: ValueOf<typeof MeetingHost>;
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
		host: ValueOf<typeof MeetingHost>;
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
