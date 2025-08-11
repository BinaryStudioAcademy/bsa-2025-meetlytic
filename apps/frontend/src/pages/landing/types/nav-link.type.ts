import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type AppRouteValue = ValueOf<typeof AppRoute>;

type NavLink = {
	label: string;
	to: AppRouteValue;
};

export { type NavLink };
