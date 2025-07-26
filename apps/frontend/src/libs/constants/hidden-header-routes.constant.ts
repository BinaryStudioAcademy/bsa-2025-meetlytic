import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const HIDDEN_HEADER_ROUTES = [AppRoute.SIGN_IN, AppRoute.SIGN_UP] as ValueOf<
	typeof AppRoute
>[];

export { HIDDEN_HEADER_ROUTES };
