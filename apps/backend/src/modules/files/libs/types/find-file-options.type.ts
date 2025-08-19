import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type FindFileOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type FindFileOptions };
