import ArrowRight from "~/assets/img/icons/arrow-right.svg?react";
import Meetings from "~/assets/img/icons/meetings.svg?react";
import Settings from "~/assets/img/icons/settings.svg?react";

const iconNameToSvg = {
	arrowRight: ArrowRight,
	meetings: Meetings,
	settings: Settings,
} as const;

export { iconNameToSvg };
