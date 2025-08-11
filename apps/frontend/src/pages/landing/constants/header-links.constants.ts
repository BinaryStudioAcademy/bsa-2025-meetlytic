import { AppRoute } from "~/libs/enums/enums.js";

import { type NavLink } from "./../types/types.js";

const HEADER_LINKS: NavLink[] = [
	{ label: "Features", to: AppRoute.ROOT },
	{ label: "Contacts", to: AppRoute.ROOT },
];

export { HEADER_LINKS };
