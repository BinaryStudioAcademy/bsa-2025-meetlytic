import ArrowRight from "~/assets/img/icons/arrow-right.svg?react";
import BurgerMenu from "~/assets/img/icons/burger-menu.svg?react";
import CloseIcon from "~/assets/img/icons/close-icon.svg?react";
import HidePassword from "~/assets/img/icons/hide-password.svg?react";
import Logout from "~/assets/img/icons/logout.svg?react";
import Meetings from "~/assets/img/icons/meetings.svg?react";
import Pause from "~/assets/img/icons/pause.svg?react";
import Play from "~/assets/img/icons/play.svg?react";
import Search from "~/assets/img/icons/search.svg?react";
import Settings from "~/assets/img/icons/settings.svg?react";
import ShowPassword from "~/assets/img/icons/show-password.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<
	IconName,
	React.FC<React.SVGProps<SVGSVGElement>>
> = {
	arrowRight: ArrowRight,
	burgerMenu: BurgerMenu,
	closeIcon: CloseIcon,
	hidePassword: HidePassword,
	logout: Logout,
	meetings: Meetings,
	pause: Pause,
	play: Play,
	search: Search,
	settings: Settings,
	showPassword: ShowPassword,
};

export { iconNameToSvg };
