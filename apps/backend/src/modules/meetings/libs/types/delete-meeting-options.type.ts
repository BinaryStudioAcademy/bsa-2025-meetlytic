import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type DeleteMeetingOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type DeleteMeetingOptions };
