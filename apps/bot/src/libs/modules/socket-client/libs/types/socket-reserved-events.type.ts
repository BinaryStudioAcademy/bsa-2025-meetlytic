import { type SocketEvent } from "../enums/enums.js";

type SocketReservedEvents = {
	[SocketEvent.CONNECT]: () => void;
	[SocketEvent.CONNECT_ERROR]: (error: Error) => void;
	[SocketEvent.DISCONNECT]: (reason: string) => void;
};

export { type SocketReservedEvents };
