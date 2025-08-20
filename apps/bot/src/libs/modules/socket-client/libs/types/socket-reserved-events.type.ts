type SocketReservedEvents = {
	connect: () => void;
	connect_error: (error: Error) => void;
	disconnect: (reason: string) => void;
};

export { type SocketReservedEvents };
