import { type Server as HttpServer } from "node:http";
import { type Socket, Server as SocketServer } from "socket.io";

import { HTTPMethod } from "~/libs/modules/http/http.js";
import { meetingService } from "~/modules/meetings/meetings.js";

import { type Logger } from "../logger/logger.js";
import {
	AllowedOrigin,
	SocketEvent,
	SocketMessage,
} from "./libs/enums/enums.js";
import {
	type MeetingAudioRequestDto,
	type MeetingTranscriptionRequestDto,
	type SocketService,
} from "./libs/types/types.js";

class BaseSocketService implements SocketService {
	private io!: SocketServer;
	private logger: Logger;

	public constructor(logger: Logger) {
		this.logger = logger;
	}
	private onConnection = (socket: Socket): void => {
		this.logger.info(`${SocketMessage.CLIENT_CONNECTED} ${socket.id}`);

		this.registerTranscriptionEvents(socket);
		this.registerAudioEvents(socket);

		socket.on(SocketEvent.DISCONNECT, (reason) => {
			this.logger.warn(
				`${SocketMessage.CLIENT_DISCONNECTED} ${socket.id}, ${reason}`,
			);
		});
		socket.on(SocketEvent.ERROR, (error) => {
			this.logger.error(`${SocketMessage.CLIENT_ERROR} ${String(error)}`);
		});
	};

	private registerAudioEvents = (socket: Socket): void => {
		socket.on(
			SocketEvent.AUDIO_SAVE,
			async (payload: MeetingAudioRequestDto) => {
				try {
					this.logger.info(SocketMessage.AUDIO_SAVE_RECEIVED);
					await meetingService.saveAudio(payload);
				} catch (error) {
					this.logger.error(
						`${SocketMessage.AUDIO_SAVE_ERROR} ${String(error)}`,
					);
				}
			},
		);
	};

	private registerTranscriptionEvents = (socket: Socket): void => {
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
	};

	public initialize(server: HttpServer): void {
		this.io = new SocketServer(server, {
			cors: {
				methods: [HTTPMethod.GET, HTTPMethod.POST],
				origin: AllowedOrigin.ALL,
			},
		});

		this.io.on(SocketEvent.CONNECTION, this.onConnection);
	}
}

export { BaseSocketService };
