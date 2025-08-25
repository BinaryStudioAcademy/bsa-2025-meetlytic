import {
	MeetingStatus,
	SocketEvent,
	SocketNamespace,
} from "~/libs/enums/enums.js";
import { useEffect } from "~/libs/hooks/hooks.js";
import { socketClient } from "~/libs/modules/socket/socket.js";
import {
	type MeetingStatusDto,
	type MeetingSummaryActionItemsResponseDto,
} from "~/modules/meeting-details/meeting-details.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

type MeetingSocketParameters = {
	meetingId: number;
	meetingStatus: string;
	onStatusUpdate: (data: MeetingStatusDto) => void;
	onSummaryActionItemsUpdate: (
		data: MeetingSummaryActionItemsResponseDto,
	) => void;
	onTranscriptUpdate: (data: MeetingTranscriptionResponseDto) => void;
};

const useMeetingSocket = ({
	meetingId,
	meetingStatus,
	onStatusUpdate,
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

		const handleStatusUpdate = (payload: MeetingStatusDto): void => {
			if (payload.meetingId === meetingId) {
				onStatusUpdate(payload);
			}
		};

		socket.on(SocketEvent.UPDATE_MEETING_STATUS, handleStatusUpdate);

		socket.emit(SocketEvent.JOIN_ROOM, String(meetingId));

		return (): void => {
			socket.off(SocketEvent.TRANSCRIBE, onTranscriptUpdate);
			socket.emit(SocketEvent.LEAVE_ROOM, String(meetingId));
			socket.off(
				SocketEvent.UPDATE_MEETING_DETAILS,
				onSummaryActionItemsUpdate,
			);
			socket.off(SocketEvent.UPDATE_MEETING_STATUS, handleStatusUpdate);
		};
	}, [
		meetingId,
		meetingStatus,
		onTranscriptUpdate,
		onSummaryActionItemsUpdate,
	]);
};

export { useMeetingSocket };
