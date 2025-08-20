import { type Server as HttpServer } from "node:http";
import { type Socket, Server as SocketServer } from "socket.io";

import { HTTPMethod } from "~/libs/modules/http/http.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { type Logger } from "../logger/logger.js";
import {
	AllowedOrigin,
	SocketEvent,
	SocketMessage,
	SocketNamespace,
} from "./libs/enums/enums.js";
import {
	type MeetingSummaryActionItemsResponseDto,
	type MeetingTranscriptionRequestDto,
	type ServerToClientEvents,
	type SocketService,
	type ValueOf,
} from "./libs/types/types.js";

type EmitParameters<K extends keyof ServerToClientEvents> = {
	event: K;
	namespace?: ValueOf<typeof SocketNamespace>;
	parameters?: Parameters<ServerToClientEvents[K]>;
	room: string;
};

class BaseSocketService implements SocketService {
	private io!: SocketServer;
	private logger: Logger;

	public constructor(logger: Logger) {
		this.logger = logger;
	}

	private handleBotsConnection(socket: Socket): void {
		this.logger.info(`BOT ${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		socket.on(SocketEvent.JOIN_ROOM, async (meetingId: string) => {
			this.logger.info(`Client ${socket.id} joining room: ${meetingId}`);
			await socket.join(meetingId);
		});

		socket.on(SocketEvent.RECORDING_STOPPED, async (meetingId: string) => {
			this.logger.info(`Getting full transcript of meeting ${meetingId}`);
			const { items } = await meetingService.getTranscriptionsByMeetingId(
				Number(meetingId),
			);

			let transcript = "";

			for (const chunk of items) {
				transcript += chunk.chunkText;
			}

			socket.emit(SocketEvent.GENERATE_SUMMARY_ACTION_ITEMS, transcript);
		});

		socket.on(
			SocketEvent.SAVE_SUMMARY_ACTION_ITEMS,
			async (payload: MeetingSummaryActionItemsResponseDto) => {
				const { meetingId, ...summaryActionItems } = payload;
				this.logger.info(
					`Updating summary/action items of the meeting ${meetingId}`,
				);
				await meetingService.update(Number(meetingId), summaryActionItems);
				this.logger.info(`Ending meeting ${meetingId}`);
				await meetingService.endMeeting(Number(meetingId));
				this.emitTo({
					event: SocketEvent.UPDATE_MEETING_DETAILS,
					namespace: SocketNamespace.USERS,
					parameters: [payload],
					room: String(payload.meetingId),
				});
			},
		);

		socket.on(
			SocketEvent.TRANSCRIBE,
			async (payload: MeetingTranscriptionRequestDto) => {
				try {
					this.logger.info(SocketMessage.SOCKET_EVENT_RECEIVED);

					const transcription = await meetingService.saveChunk(payload);

					if (payload.meetingId) {
						this.emitTo({
							event: SocketEvent.TRANSCRIBE,
							namespace: SocketNamespace.USERS,
							parameters: [transcription],
							room: String(payload.meetingId),
						});
					}
				} catch (error) {
					this.logger.error(
						`${SocketMessage.TRANSCRIPTION_ERROR} ${String(error)}`,
					);
				}
			},
		);

		socket.on(SocketEvent.GET_PUBLIC_URL, async (meetingId: number) => {
			this.logger.info(
				`BOT ${socket.id} requesting public url for the meeting ${String(meetingId)}`,
			);
			socket.emit(
				SocketEvent.GET_PUBLIC_URL,
				await meetingService.getPublicUrl(meetingId),
			);
		});
	}

	private handleUsersConnection(socket: Socket): void {
		this.logger.info(`USER ${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		socket.on(SocketEvent.JOIN_ROOM, async (meetingId: string) => {
			try {
				await socket.join(meetingId);
				this.logger.info(`Socket ${socket.id} joined room ${meetingId}`);
			} catch (error) {
				this.logger.error(`Failed to join room ${meetingId}: ${String(error)}`);
			}
		});

		socket.on(SocketEvent.LEAVE_ROOM, async (meetingId: string) => {
			try {
				await socket.leave(meetingId);
				this.logger.info(`Socket ${socket.id} left room ${meetingId}`);
			} catch (error) {
				this.logger.error(
					`Failed to leave room ${meetingId} for socket ${socket.id}: ${String(error)}`,
				);
			}
		});

		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessage.CLIENT_ERROR} ${String(error)}`);
		});
	}

	public emitTo<K extends keyof ServerToClientEvents>(
		options: EmitParameters<K>,
	): void {
		const { event, namespace = "/", parameters = [], room } = options;
		this.logger.info(
			`Emmiting event: ${event} to namespace: ${namespace} room: ${room}`,
		);
		this.io
			.of(namespace)
			.to(room)
			.emit(event, ...parameters);
	}

	public initialize(server: HttpServer): void {
		this.io = new SocketServer(server, {
			cors: {
				methods: [HTTPMethod.GET, HTTPMethod.POST],
				origin: AllowedOrigin.ALL,
			},
		});
		this.io
			.of(SocketNamespace.BOTS)
			.on(SocketEvent.CONNECTION, this.handleBotsConnection.bind(this));
		this.io
			.of(SocketNamespace.USERS)
			.on(SocketEvent.CONNECTION, this.handleUsersConnection.bind(this));
		this.logger.info("Socket.IO server initialized");
	}
}

export { BaseSocketService };
