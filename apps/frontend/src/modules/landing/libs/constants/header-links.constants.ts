import { AppRoute, LandingAnchor } from "~/libs/enums/enums.js";
import { type NavLinkType } from "~/modules/landing/landing.js";

const HEADER_LINKS: NavLinkType[] = [
	{ label: "Features", to: LandingAnchor.FEATURES },
	{ label: "Contacts", to: AppRoute.ROOT },
];

export { HEADER_LINKS };
