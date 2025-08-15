import { AppRoute, LandingAnchor } from "~/libs/enums/enums.js";

import { type LinkGroup } from "./../types/types.js";

const COMPANY_LINKS: LinkGroup = {
	links: [
		{ label: "Home", to: AppRoute.ROOT },
		{ label: "Features", to: LandingAnchor.FEATURES },
	],
	title: "Company",
};

export { COMPANY_LINKS };
