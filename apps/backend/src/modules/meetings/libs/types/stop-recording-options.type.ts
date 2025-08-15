import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type StopRecordingOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type StopRecordingOptions };
