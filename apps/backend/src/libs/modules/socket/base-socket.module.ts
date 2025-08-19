import { type Server as HttpServer } from "node:http";
import { type Socket, Server as SocketServer } from "socket.io";

import { HTTPMethod } from "~/libs/modules/http/http.js";
import { fileService } from "~/modules/files/files.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { type Logger } from "../logger/logger.js";
import {
	AllowedOrigin,
	ContentType,
	SocketEvent,
	SocketMessage,
} from "./libs/enums/enums.js";
import {
	type MeetingAudioSaveDto,
	type MeetingTranscriptionRequestDto,
	type SocketService,
} from "./libs/types/types.js";

class BaseSocketService implements SocketService {
	private io!: SocketServer;
	private logger: Logger;

	public constructor(logger: Logger) {
		this.logger = logger;
	}

	private handleAudioEvents = (socket: Socket): void => {
		socket.on(SocketEvent.AUDIO_SAVE, async (payload: MeetingAudioSaveDto) => {
			try {
				this.logger.info(SocketMessage.AUDIO_SAVE_RECEIVED);

				const createdFile = await fileService.create({
					contentType: ContentType.AUDIO,
					key: payload.key,
					url: payload.url,
				});

				await meetingService.attachAudioFile(payload.meetingId, {
					fileId: createdFile.id,
				});

				this.logger.info(SocketMessage.AUDIO_SAVE_RECEIVED);
			} catch (error) {
				this.logger.error(`${SocketMessage.AUDIO_SAVE_ERROR} ${String(error)}`);
			}
		});
	};

	private handleClientConnection(socket: Socket): void {
		this.logger.info(`${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		this.handleAudioEvents(socket);
		this.handleJoinMeeting(socket);
		this.handleTranscription(socket);
		this.handleError(socket);
	}

	private handleError(socket: Socket): void {
		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessage.CLIENT_ERROR} ${String(error)}`);
		});
	}

	private handleJoinMeeting(socket: Socket): void {
		socket.on(SocketEvent.JOIN_MEETING, async (meetingId: string) => {
			try {
				await socket.join(meetingId);
				this.logger.info(`Socket ${socket.id} joined room ${meetingId}`);
			} catch (error) {
				this.logger.error(`Failed to join room ${meetingId}: ${String(error)}`);
			}
		});

		socket.on(SocketEvent.LEAVE_MEETING, async (meetingId: string) => {
			try {
				await socket.leave(meetingId);
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
