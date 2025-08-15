import { AppRoute, LandingAnchor } from "~/libs/enums/enums.js";

import { type NavLink } from "./../types/types.js";

const HEADER_LINKS: NavLink[] = [
	{ label: "Features", to: LandingAnchor.FEATURES },
	{ label: "Contacts", to: AppRoute.ROOT },
];

export { HEADER_LINKS };
