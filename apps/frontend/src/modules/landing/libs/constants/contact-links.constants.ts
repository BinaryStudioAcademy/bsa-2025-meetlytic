import { AppRoute } from "~/libs/enums/enums.js";

import { type LinkGroup } from "../types/types.js";

const CONTACT_LINKS: LinkGroup = {
	links: [
		{ label: "Site", to: AppRoute.ROOT },
		{ label: "E-mail", to: AppRoute.ROOT },
	],
	title: "Contact",
};

export { CONTACT_LINKS };
