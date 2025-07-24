import { AppRoute } from "~/libs/enums/enums.js";
import { AppRouteValues } from "~/libs/types/types.js";

function isAppRoute(path: string) {
	return Object.values(AppRoute).includes(path as AppRouteValues);
}

export { isAppRoute };
