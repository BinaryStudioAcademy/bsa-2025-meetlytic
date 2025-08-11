import { AppRoute } from "~/libs/enums/enums.js";

import { type LinkGroup } from "./../types/types.js";

const COMPANY_LINKS: LinkGroup = {
	links: [
		{ label: "Home", to: AppRoute.ROOT },
		{ label: "Features", to: AppRoute.ROOT },
		{ label: "Download The App", to: AppRoute.ROOT },
	],
	title: "Company",
};

export { COMPANY_LINKS };
