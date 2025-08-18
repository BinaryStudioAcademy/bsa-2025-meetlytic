import { type Server as HttpServer } from "node:http";
import { type Socket, Server as SocketServer } from "socket.io";

import { HTTPMethod } from "~/libs/modules/http/http.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { type Logger } from "../logger/logger.js";
import { EMPTY_ROOMS_SIZE } from "./libs/constants/constants.js";
import {
	AllowedOrigin,
	SocketEvent,
	SocketMessage,
} from "./libs/enums/enums.js";
import {
	type MeetingTranscriptionRequestDto,
	type SocketService,
} from "./libs/types/types.js";

class BaseSocketService implements SocketService {
	private io!: SocketServer;
	private logger: Logger;
	private socketRooms: Map<string, Set<string>> = new Map();

	public constructor(logger: Logger) {
		this.logger = logger;
	}

	private handleClientConnection(socket: Socket): void {
		this.logger.info(`${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		this.handleJoinMeeting(socket);
		this.handleTranscription(socket);
		this.handleDisconnect(socket);
		this.handleError(socket);
	}

	private handleDisconnect(socket: Socket): void {
		socket.on(SocketEvent.DISCONNECT, async (reason) => {
			this.logger.warn(
				`${SocketMessage.CLIENT_DISCONNECTED} ${socket.id}, ${reason}`,
			);

			const rooms = this.socketRooms.get(socket.id);

			if (rooms) {
				for (const meetingId of rooms) {
					await socket.leave(meetingId);
					this.logger.info(
						`Socket ${socket.id} left room ${meetingId} on disconnect`,
					);
				}

				this.socketRooms.delete(socket.id);
			}
		});
	}

	private handleError(socket: Socket): void {
		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessage.CLIENT_ERROR} ${String(error)}`);
		});
	}

	private handleJoinMeeting(socket: Socket): void {
		socket.on(SocketEvent.JOIN_MEETING, async (meetingId: string) => {
			const rooms = this.socketRooms.get(socket.id) ?? new Set();

			if (rooms.has(meetingId)) {
				this.logger.info(`Socket ${socket.id} already in room ${meetingId}`);

				return;
			}

			try {
				await socket.join(meetingId);
				rooms.add(meetingId);
				this.socketRooms.set(socket.id, rooms);
				this.logger.info(`Socket ${socket.id} joined room ${meetingId}`);
			} catch (error) {
				this.logger.error(`Failed to join room ${meetingId}: ${String(error)}`);
			}
		});

		socket.on(SocketEvent.LEAVE_MEETING, async (meetingId: string) => {
			try {
				const rooms = this.socketRooms.get(socket.id);

				if (!rooms || !rooms.has(meetingId)) {
					this.logger.info(`Socket ${socket.id} not in room ${meetingId}`);

					return;
				}

				await socket.leave(meetingId);
				rooms.delete(meetingId);

				if (rooms.size === EMPTY_ROOMS_SIZE) {
					this.socketRooms.delete(socket.id);
				} else {
					this.socketRooms.set(socket.id, rooms);
				}

				this.logger.info(`Socket ${socket.id} left room ${meetingId}`);
			} catch (error) {
				this.logger.error(
					`Failed to leave room ${meetingId} for socket ${socket.id}: ${String(error)}`,
				);
			}
		});
	}

	private handleTranscription(socket: Socket): void {
		socket.on(
			SocketEvent.TRANSCRIBE,
			async (payload: MeetingTranscriptionRequestDto) => {
				try {
					this.logger.info(SocketMessage.SOCKET_EVENT_RECEIVED);

					const transcription = await meetingService.saveChunk(payload);

					if (payload.meetingId) {
						this.io
							.to(String(payload.meetingId))
							.emit(SocketEvent.TRANSCRIBE, transcription);
					}
				} catch (error) {
					this.logger.error(
						`${SocketMessage.TRANSCRIPTION_ERROR} ${String(error)}`,
					);
				}
			},
		);
	}

	public initialize(server: HttpServer): void {
		this.io = new SocketServer(server, {
			cors: {
				methods: [HTTPMethod.GET, HTTPMethod.POST],
				origin: AllowedOrigin.ALL,
			},
		});

		this.io.on(SocketEvent.CONNECTION, this.handleClientConnection.bind(this));
	}
}

export { BaseSocketService };
