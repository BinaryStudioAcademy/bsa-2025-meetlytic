import { createServer, type Server as HttpServer } from "node:http";

import { type Config } from "~/libs/modules/config/config.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type SocketService } from "~/libs/modules/socket/socket.js";
import { type ZoomBot } from "~/libs/modules/zoom/zoom-bot.js";

import { type ServerApplication } from "./libs/types/types.js";

type Constructor = {
	config: Config;
	logger: Logger;
	socketService: SocketService;
	zoomBot: ZoomBot;
};

class BaseServerApplication implements ServerApplication {
	private config: Config;
	private logger: Logger;
	private server!: HttpServer;
	private socketService: SocketService;
	private zoomBot: ZoomBot;

	public constructor({ config, logger, socketService, zoomBot }: Constructor) {
		this.config = config;
		this.logger = logger;
		this.socketService = socketService;
		this.zoomBot = zoomBot;
		this.initServer();
	}

	private initServer(): void {
		this.server = createServer();
	}

	public async init(): Promise<void> {
		const { ENVIRONMENT, HOST: host, PORT: port } = this.config.ENV.APP;
		this.logger.info("Application initialization…");

		this.socketService.initialize(this.server);

		await this.zoomBot.run();

		try {
			this.server.listen(port, host, () => {
				this.logger.info(
					`Application is listening on PORT - ${String(port)}, on ENVIRONMENT - ${String(
						ENVIRONMENT,
					)}.`,
				);
			});
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message, {
					cause: error.cause,
					stack: error.stack,
				});
			}

			throw error;
		}
	}
}

export { BaseServerApplication };
