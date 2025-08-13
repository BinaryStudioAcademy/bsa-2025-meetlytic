import { AppRoute } from "~/libs/enums/enums.js";
import { type NavigationItem } from "~/libs/types/types.js";

const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		href: AppRoute.MEETINGS,
		icon: "meetings",
		label: "Meetings",
	},
	{
		href: AppRoute.MEETINGS,
		icon: "meetings",
		label: "One more 1",
	},
	{
		href: AppRoute.MEETINGS,
		icon: "meetings",
		label: "One more 2",
	},
];

export { NAVIGATION_ITEMS };
