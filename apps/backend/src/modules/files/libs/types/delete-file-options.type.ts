import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type DeleteFileOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type DeleteFileOptions };
