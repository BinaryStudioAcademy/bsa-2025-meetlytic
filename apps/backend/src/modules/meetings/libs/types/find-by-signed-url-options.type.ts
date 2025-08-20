import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type FindBySignedUrlOptions = APIHandlerOptions<{
	params: { id: string };
	query: { token: string };
}>;

export { type FindBySignedUrlOptions };
