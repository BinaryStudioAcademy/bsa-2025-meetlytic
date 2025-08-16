import { type BaseSocketClient } from "~/libs/modules/socket-client/socket-client.js";
import {
	type AudioRecorder,
	type BaseConfig,
	type Logger,
	type OpenAI,
} from "~/libs/types/types.js";

type ZoomBotOptions = {
	audioRecorder: AudioRecorder;
	config: BaseConfig;
	logger: Logger;
	openAI: OpenAI;
	socketClient: BaseSocketClient;
};

export { type ZoomBotOptions };
