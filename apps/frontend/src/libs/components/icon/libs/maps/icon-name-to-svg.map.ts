import ArrowRight from "~/assets/img/icons/arrow-right.svg?react";
import Logout from "~/assets/img/icons/logout.svg?react";
import Meetings from "~/assets/img/icons/meetings.svg?react";
import Search from "~/assets/img/icons/search.svg?react";
import Settings from "~/assets/img/icons/settings.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<
	IconName,
	React.FC<React.SVGProps<SVGSVGElement>>
> = {
	arrowRight: ArrowRight,
	logout: Logout,
	meetings: Meetings,
	search: Search,
	settings: Settings,
};

export { iconNameToSvg };
