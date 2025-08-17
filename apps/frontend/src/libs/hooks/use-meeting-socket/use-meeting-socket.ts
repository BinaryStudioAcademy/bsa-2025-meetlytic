import { useEffect } from "react";

import {
	MeetingStatus,
	SocketEvent,
	SocketNamespace,
} from "~/libs/enums/enums.js";
import { socketClient } from "~/libs/modules/socket/socket.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

const useMeetingSocket = (
	meetingId: number,
	onMessage: (data: MeetingTranscriptionResponseDto) => void,
	meetingStatus: string,
): void => {
	useEffect(() => {
		if (!meetingId || meetingStatus === MeetingStatus.ENDED) {
			return;
		}

		const socket = socketClient.getInstance(SocketNamespace.ROOT);

		if (!socket.connected) {
			socket.connect();
		}

		const handleMessage = (data: MeetingTranscriptionResponseDto): void => {
			onMessage(data);
		};

		socket.on(SocketEvent.MESSAGE, handleMessage);
		socket.emit(SocketEvent.JOIN_MEETING, String(meetingId));

		return (): void => {
			socket.off(SocketEvent.MESSAGE, handleMessage);
			socket.emit(SocketEvent.LEAVE_MEETING, String(meetingId));
		};
	}, [meetingId, meetingStatus, onMessage]);
};

export { useMeetingSocket };
