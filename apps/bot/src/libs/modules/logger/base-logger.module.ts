import fs from "node:fs";
import path from "node:path";
import { type Logger as LibraryLogger, pino } from "pino";

import { type Logger } from "./libs/types/types.js";

const logFilePath = path.join("logs", "app.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

class BaseLogger implements Logger {
	private logger: LibraryLogger;

	public constructor() {
		this.logger = pino({}, logStream);

		this.logger.info("Logger is created and writing to logs/app.log");
	}

	public debug(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["debug"]> {
		this.logger.debug(parameters, message);
	}

	public error(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["error"]> {
		this.logger.error(parameters, message);
	}

	public info(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["info"]> {
		this.logger.info(parameters, message);
	}

	public warn(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["warn"]> {
		this.logger.warn(parameters, message);
	}
}

export { BaseLogger };
