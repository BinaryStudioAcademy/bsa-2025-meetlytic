import { LandingSection } from "~/libs/enums/enums.js";

import { type LinkGroup } from "../types/types.js";

const COMPANY_LINKS: LinkGroup = {
	links: [
		{ label: "Home", to: LandingSection.HOME },
		{ label: "Features", to: LandingSection.FEATURES },
	],
	title: "Company",
};

export { COMPANY_LINKS };
