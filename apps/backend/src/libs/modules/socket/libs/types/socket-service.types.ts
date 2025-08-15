import { type Server as HttpServer } from "node:http";

type SocketService = {
	initialize: (server: HttpServer) => void;
};

export { type SocketService };
