import { HashLink } from "~/libs/components/components.js";
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
	return (
		<HashLink className={className} smooth={isSmooth} to={to}>
			{children}
		</HashLink>
	);
};

export { Link };
