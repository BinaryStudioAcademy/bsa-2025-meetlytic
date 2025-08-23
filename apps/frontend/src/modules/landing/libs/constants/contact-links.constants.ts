import { AppRoute, LandingSection } from "~/libs/enums/enums.js";

import { type LinkGroup } from "../types/types.js";

const CONTACT_LINKS: LinkGroup = {
	links: [
		{ label: "Site", to: AppRoute.ROOT },
		{ label: "E-mail", to: LandingSection.EMAIL },
	],
	title: "Contact",
};

export { CONTACT_LINKS };
