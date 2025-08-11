import { AppRoute } from "~/libs/enums/enums.js";

import { type LinkGroup } from "./../types/types.js";

const ABOUT_LINKS: LinkGroup = {
	links: [
		{ label: "Terms & Conditions", to: AppRoute.ROOT },
		{ label: "Privacy Policy", to: AppRoute.ROOT },
	],
	title: "About",
};

export { ABOUT_LINKS };
