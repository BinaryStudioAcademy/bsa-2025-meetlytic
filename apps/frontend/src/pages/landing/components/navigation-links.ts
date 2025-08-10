import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type AppRouteValue = ValueOf<typeof AppRoute>;

type LinkGroup = {
	links: NavLink[];
	title: string;
};

type NavLink = {
	label: string;
	to: AppRouteValue;
};

const COMPANY_LINKS: LinkGroup = {
	links: [
		{ label: "Home", to: AppRoute.ROOT },
		{ label: "Features", to: AppRoute.ROOT },
		{ label: "Download The App", to: AppRoute.ROOT },
	],
	title: "Company",
};

const CONTACT_LINKS: LinkGroup = {
	links: [
		{ label: "Site", to: AppRoute.ROOT },
		{ label: "E-mail", to: AppRoute.ROOT },
	],
	title: "Contact",
};

const ABOUT_LINKS: LinkGroup = {
	links: [
		{ label: "Terms & Conditions", to: AppRoute.ROOT },
		{ label: "Privacy Policy", to: AppRoute.ROOT },
	],
	title: "About",
};

const HEADER_LINKS: NavLink[] = [
	{ label: "Features", to: AppRoute.ROOT },
	{ label: "Contacts", to: AppRoute.ROOT },
];

export { ABOUT_LINKS, COMPANY_LINKS, CONTACT_LINKS, HEADER_LINKS };
export { type LinkGroup };
