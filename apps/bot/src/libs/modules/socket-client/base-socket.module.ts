import { io, type Socket } from "socket.io-client";

import { logger } from "../logger/logger.js";
import { SocketNamespace } from "./enums/enums.js";
import {
	type ClientToServerEvents,
	type ServerToClientEvents,
	type SocketReservedEvents,
} from "./libs/types/types.js";

type EventKeys = keyof ServerToClientEvents | keyof SocketReservedEvents;
type Listener<K extends EventKeys> = K extends keyof SocketReservedEvents
	? SocketReservedEvents[K]
	: K extends keyof ServerToClientEvents
		? ServerToClientEvents[K]
		: never;

class BaseSocketClient {
	private socket: null | Socket<ServerToClientEvents, ClientToServerEvents> =
		null;
	private url: string;
	public constructor(url: string) {
		this.url = url;
	}

	private getOrigin = (url: string, namespace: string): string =>
		`${url}${namespace}`;

	public connect(): void {
		if (!this.socket) {
			this.socket = io(this.getOrigin(this.url, SocketNamespace.BOTS), {
				reconnection: true,
				reconnectionAttempts: Infinity,
				reconnectionDelay: 1000,
				transports: ["websocket"],
			});

			logger.info(
				`Bot is connecting to  ${this.getOrigin(this.url, SocketNamespace.BOTS)}`,
			);
		} else if (!this.socket.connected) {
			this.socket.connect();
		}
	}

	public disconnect(): void {
		this.socket?.disconnect();
	}

	public emit<K extends keyof ClientToServerEvents>(
		event: K,
		...parameters: Parameters<ClientToServerEvents[K]>
	): void {
		this.socket?.emit(event, ...parameters);
	}

	public on<
		K extends keyof ServerToClientEvents,
		L extends keyof SocketReservedEvents,
	>(event: K | L, listener: Listener<K | L>): void {
		this.socket?.on(event, listener as Listener<K>);
	}
}

export { BaseSocketClient };
