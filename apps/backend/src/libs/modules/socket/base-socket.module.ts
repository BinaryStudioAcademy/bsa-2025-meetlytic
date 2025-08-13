import { type Server as HttpServer } from "node:http";
import { type Socket, Server as SocketServer } from "socket.io";

import { HTTPMethod } from "~/libs/modules/http/http.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { type Logger } from "../logger/logger.js";
import {
	AllowedOrigin,
	SocketEvent,
	SocketMessages,
} from "./libs/enums/enums.js";
import { type SocketService } from "./libs/types/types.js";

class BaseSocketService implements SocketService {
	private io!: SocketServer;
	private logger: Logger;

	public constructor(logger: Logger) {
		this.logger = logger;
	}

	private transcriptionsHandler(socket: Socket): void {
		this.logger.info(`${SocketMessages.CLIENT_CONNECTED} ${socket.id}`);

		socket.on(
			SocketEvent.TRANSCRIPTION,
			async (payload: { chunkText: string; zoomMeetingId: string }) => {
				try {
					this.logger.info(SocketMessages.SOCKET_EVENT_RECEIVED);

					await meetingService.saveChunk(payload);
				} catch (error) {
					this.logger.error(
						`${SocketMessages.TRANSCRIPTION_ERROR} ${String(error)}`,
					);
				}
			},
		);
		socket.on(SocketEvent.DISCONNECT, (reason) => {
			this.logger.warn(
				`${SocketMessages.CLIENT_DISCONNECTED} ${socket.id},${reason}`,
			);
		});
		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessages.CLIENT_ERROR} ${String(error)}`);
		});
	}

	public initialize(server: HttpServer): void {
		this.io = new SocketServer(server, {
			cors: {
				methods: [HTTPMethod.GET, HTTPMethod.POST],
				origin: AllowedOrigin.ALL,
			},
		});
		this.io.on(SocketEvent.CONNECTION, this.transcriptionsHandler.bind(this));
	}
}

export { BaseSocketService };
