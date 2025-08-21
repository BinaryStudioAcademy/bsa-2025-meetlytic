import { HashLink } from "~/libs/components/components.js";
import { type AppRoute, type LandingSection } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type Properties = {
	children: React.ReactNode;
	className?: string | undefined;
	smooth?: boolean;
	to: ValueOf<typeof AppRoute> | ValueOf<typeof LandingSection>;
};

const Link: React.FC<Properties> = ({
	children,
	className = "",
	smooth = true,
	to,
}: Properties) => {
	return (
		<HashLink className={className} smooth={smooth} to={to}>
			{children}
		</HashLink>
	);
};

export { Link };
