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
	type MeetingSummaryActionPointsResponseDto,
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

	private botsConnectionHandler(socket: Socket): void {
		this.logger.info(`${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		socket.on(SocketEvent.JOIN_ROOM, async (meetingId: string) => {
			this.logger.info(`Client ${socket.id} joining room: ${meetingId}`);
			await socket.join(meetingId);
		});

		socket.on(SocketEvent.RECORDING_STOPPED, async (meetingId: string) => {
			this.logger.info(`Getting full transcript of meeting ${meetingId}`);
			const tarnscriptChunks = await meetingService.getTranscriptById(
				Number(meetingId),
			);

			let transcript = "";

			for (const chunk of tarnscriptChunks) {
				transcript += chunk.chunkText;
			}

			socket.emit(SocketEvent.GENERATE_SUMMARY_ACTION_ITEMS, transcript);
		});

		socket.on(
			SocketEvent.SAVE_SUMMARY_ACTION_ITEMS,
			async (payload: MeetingSummaryActionPointsResponseDto) => {
				const { meetingId, ...summaryActionItems } = payload;
				this.logger.info(
					`Updating summary/action items of the meeting ${meetingId}`,
				);
				await meetingService.update(Number(meetingId), summaryActionItems);
				this.logger.info(`Ending meeting ${meetingId}`);
				await meetingService.endMeeting(Number(meetingId));
			},
		);

		socket.on(
			SocketEvent.TRANSCRIBE,
			async (payload: MeetingTranscriptionRequestDto) => {
				try {
					this.logger.info(SocketMessage.SOCKET_EVENT_RECEIVED);

					await meetingService.saveChunk(payload);
				} catch (error) {
					this.logger.error(
						`${SocketMessage.TRANSCRIPTION_ERROR} ${String(error)}`,
					);
				}
			},
		);
		socket.on(SocketEvent.DISCONNECT, (reason) => {
			this.logger.warn(
				`${SocketMessage.CLIENT_DISCONNECTED} ${socket.id},${reason}`,
			);
		});
		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessage.CLIENT_ERROR} ${String(error)}`);
		});
	}

	private usersConnectionHandler(socket: Socket): void {
		this.logger.info(`${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		socket.on(SocketEvent.DISCONNECT, (reason) => {
			this.logger.warn(
				`${SocketMessage.CLIENT_DISCONNECTED} ${socket.id},${reason}`,
			);
		});
		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessage.CLIENT_ERROR} ${String(error)}`);
		});
	}

	public emitTo<K extends keyof ServerToClientEvents>(
		parameters_: EmitParameters<K>,
	): void {
		const { event, namespace = "/", parameters = [], room } = parameters_;
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
			.on(SocketEvent.CONNECTION, this.botsConnectionHandler.bind(this));
		this.io
			.of(SocketNamespace.USERS)
			.on(SocketEvent.CONNECTION, this.usersConnectionHandler.bind(this));
	}
}

export { BaseSocketService };
