import {
	MeetingStatus,
	SocketEvent,
	SocketNamespace,
} from "~/libs/enums/enums.js";
import { useAppSelector, useEffect } from "~/libs/hooks/hooks.js";
import { socketClient } from "~/libs/modules/socket/socket.js";
import { type ValueOf } from "~/libs/types/types.js";

type UseMeetingSocketParameters<T> = {
	callback: (data: T) => void;
	event: ValueOf<typeof SocketEvent>;
	namespace?: ValueOf<typeof SocketNamespace>;
};

const useMeetingSocket = <T>({
	callback,
	event,
	namespace = SocketNamespace.USERS,
}: UseMeetingSocketParameters<T>): void => {
	const meeting = useAppSelector(
		({ meetingDetails }) => meetingDetails.meeting,
	);

	const meetingId = meeting?.id;
	const meetingStatus = meeting?.status;

	useEffect(() => {
		if (!meetingId || meetingStatus === MeetingStatus.ENDED) {
			return;
		}

		const socket = socketClient.getInstance(namespace);

		if (!socket.connected) {
			socket.connect();
		}

		socket.on(event, callback);

		socket.emit(SocketEvent.JOIN_ROOM, String(meetingId));

		return (): void => {
			socket.emit(SocketEvent.LEAVE_ROOM, String(meetingId));
			socket.off(event, callback);
		};
	}, [meetingId, meetingStatus, callback]);
};

export { useMeetingSocket };
