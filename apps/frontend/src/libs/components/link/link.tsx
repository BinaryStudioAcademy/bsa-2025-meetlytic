import { HashLink, NavLink } from "~/libs/components/components.js";
import { type AppRoute, type LandingSection } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type Properties = {
	children: React.ReactNode;
	className?: string | undefined;
	isSmooth?: boolean;
	to: ValueOf<typeof AppRoute> | ValueOf<typeof LandingSection>;
};

const Link: React.FC<Properties> = ({
	children,
	className = "",
	isSmooth = true,
	to,
}: Properties) => {
	const isHash: boolean = typeof to === "string" && to.includes("#");

	const commonProperties = {
		children,
		className: className,
		to,
	};

	return isHash ? (
		<HashLink {...commonProperties} smooth={isSmooth} />
	) : (
		<NavLink {...commonProperties} />
	);
};

export { Link };
