import { type HTTPMethod } from "~/libs/modules/http/http.js";

type WhiteRoute = {
	method: HTTPMethod;
	path: string;
};

export { type WhiteRoute };
