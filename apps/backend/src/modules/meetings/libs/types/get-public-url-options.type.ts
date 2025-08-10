import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type GetPublicUrlOptions = APIHandlerOptions<{
	params: { id: string };
}>;

export { type GetPublicUrlOptions };
