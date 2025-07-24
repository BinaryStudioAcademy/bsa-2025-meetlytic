import { AppRoute } from "~/libs/enums/enums.js";
import { AppRouteValues } from "~/libs/types/types.js";

const HIDDEN_HEADER_ROUTES = [
	AppRoute.SIGN_IN,
	AppRoute.SIGN_UP,
] as AppRouteValues[];

export { HIDDEN_HEADER_ROUTES };
