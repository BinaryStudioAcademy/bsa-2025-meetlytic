import { type IconName } from "~/libs/types/types.js";

import { iconNameToSvg } from "./libs/maps/maps.js";

type Properties = {
	className?: string | undefined;
	color?: string | undefined;
	name: IconName;
	onClick?: (() => void) | undefined;
};

const Icon: React.FC<Properties> = ({
	className,
	color,
	name,
	onClick,
}: Properties) => {
	const Icon = iconNameToSvg[name];
	const isClickable = Boolean(onClick);

	return isClickable ? (
		<button type="button">
			<Icon className={className} color={color} onClick={onClick} />
		</button>
	) : (
		<Icon className={className} color={color} />
	);
};

export { Icon };
