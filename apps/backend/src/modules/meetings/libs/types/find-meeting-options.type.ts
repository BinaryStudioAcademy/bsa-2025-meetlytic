import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type FindMeetingOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type FindMeetingOptions };
