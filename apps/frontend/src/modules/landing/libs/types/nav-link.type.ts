import { type AppRoute, type LandingSection } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type AppRouteValue = ValueOf<typeof AppRoute>;
type LandingSectionValue = ValueOf<typeof LandingSection>;

type NavLinkType = {
	label: string;
	to: AppRouteValue | LandingSectionValue;
};

export { type NavLinkType };
