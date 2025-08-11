import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type VerifyUrlOptions = APIHandlerOptions<{
	params: { id: string };
	query: { token: string };
}>;

export { type VerifyUrlOptions };
