import { LandingSection } from "~/libs/enums/enums.js";
import { type NavLinkType } from "~/modules/landing/landing.js";

const HEADER_LINKS: NavLinkType[] = [
	{ label: "Features", to: LandingSection.FEATURES },
	{ label: "Contacts", to: LandingSection.CONTACTS },
];

export { HEADER_LINKS };
