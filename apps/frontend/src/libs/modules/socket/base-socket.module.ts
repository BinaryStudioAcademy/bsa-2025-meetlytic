import { io, type Socket as SocketClient } from "socket.io-client";

import { type SocketNamespace } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

class BaseSocket {
	private instances: Record<string, null | SocketClient> = {};

	public constructor(private baseUrl: string) {}

	public connect(namespace: ValueOf<typeof SocketNamespace>): SocketClient {
		const socket = this.getInstance(namespace);

		if (!socket.connected) {
			socket.connect();
		}

		return socket;
	}

	public disconnect(namespace: ValueOf<typeof SocketNamespace>): void {
		const socket = this.instances[namespace];

		if (socket) {
			socket.disconnect();
			this.instances[namespace] = null;
		}
	}

	public disconnectAll(): void {
		for (const key of Object.keys(this.instances)) {
			const socket = this.instances[key];

			if (socket) {
				socket.disconnect();
			}
		}

		this.instances = {};
	}

	public getInstance(namespace: ValueOf<typeof SocketNamespace>): SocketClient {
		if (this.instances[namespace]) {
			return this.instances[namespace];
		}

		const url = `${this.baseUrl}${namespace}`;
		const socketInstance = io(url, {
			autoConnect: false,
			reconnection: true,
			transports: ["websocket"],
		});

		this.instances[namespace] = socketInstance;

		return socketInstance;
	}
}

export { BaseSocket };
