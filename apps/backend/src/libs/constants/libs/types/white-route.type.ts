import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

type WhiteRoute = {
	method: ValueOf<typeof HTTPMethod>;
	path: string;
};

export { type WhiteRoute };
