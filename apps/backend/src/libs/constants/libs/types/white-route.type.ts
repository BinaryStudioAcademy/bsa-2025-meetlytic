import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

type WhiteRoute = {
	method: ValueOf<typeof HTTPMethod>;
	path: RegExp | string;
};

export { type WhiteRoute };
