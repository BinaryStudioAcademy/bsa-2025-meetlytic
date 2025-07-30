import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type FindAllMeetingOptions = APIHandlerOptions & {
	user: { id: string };
};

export { type FindAllMeetingOptions };
