import {
	MeetingStatus,
	SocketEvent,
	SocketNamespace,
} from "~/libs/enums/enums.js";
import { useEffect } from "~/libs/hooks/hooks.js";
import { socketClient } from "~/libs/modules/socket/socket.js";
import { type MeetingSummaryActionItemsResponseDto } from "~/modules/meeting-details/meeting-details.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

type MeetingSocketParameters = {
	meetingId: number;
	meetingStatus: string;
	onSummaryActionItemsUpdate: (
		data: MeetingSummaryActionItemsResponseDto,
	) => void;
	onTranscriptUpdate: (data: MeetingTranscriptionResponseDto) => void;
};

const useMeetingSocket = ({
	meetingId,
	meetingStatus,
	onSummaryActionItemsUpdate,
	onTranscriptUpdate,
}: MeetingSocketParameters): void => {
	useEffect(() => {
		if (!meetingId || meetingStatus === MeetingStatus.ENDED) {
			return;
		}

		const socket = socketClient.getInstance(SocketNamespace.USERS);

		if (!socket.connected) {
			socket.connect();
		}

		socket.on(SocketEvent.UPDATE_MEETING_DETAILS, onSummaryActionItemsUpdate);
		socket.on(SocketEvent.TRANSCRIBE, onTranscriptUpdate);
		socket.emit(SocketEvent.JOIN_ROOM, String(meetingId));

		return (): void => {
			socket.off(SocketEvent.TRANSCRIBE, onTranscriptUpdate);
			socket.emit(SocketEvent.LEAVE_ROOM, String(meetingId));
		};
	}, [
		meetingId,
		meetingStatus,
		onTranscriptUpdate,
		onSummaryActionItemsUpdate,
	]);
};

export { useMeetingSocket };
