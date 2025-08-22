import {
	MeetingStatus,
	SocketEvent,
	SocketNamespace,
} from "~/libs/enums/enums.js";
import { useEffect } from "~/libs/hooks/hooks.js";
import { socketClient } from "~/libs/modules/socket/socket.js";
import { type ValueOf } from "~/libs/types/types.js";

type UseMeetingSocketParameters<T> = {
	callback: (data: T) => void;
	event: ValueOf<typeof SocketEvent>;
	meetingId: number;
	meetingStatus: string;
	namespace?: ValueOf<typeof SocketNamespace>;
};

const useMeetingSocket = <T>({
	callback,
	event,
	meetingId,
	meetingStatus,
	namespace = SocketNamespace.USERS,
}: UseMeetingSocketParameters<T>): void => {
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
