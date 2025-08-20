import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type ExportMeetingOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type ExportMeetingOptions };
