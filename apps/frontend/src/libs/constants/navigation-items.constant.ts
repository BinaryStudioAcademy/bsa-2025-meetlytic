import { AppRoute } from "~/libs/enums/enums.js";
import { type NavigationItem } from "~/libs/types/types.js";

const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		href: AppRoute.ROOT,
		icon: "meetings",
		label: "Meetings",
	},
];

export { NAVIGATION_ITEMS };
