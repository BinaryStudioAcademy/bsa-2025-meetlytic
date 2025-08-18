import { HashLink } from "~/libs/components/components.js";
import { type AppRoute, type LandingSection } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type Properties = {
	children: React.ReactNode;
	className?: string | undefined;
	to: ValueOf<typeof AppRoute> | ValueOf<typeof LandingSection>;
};

const Link: React.FC<Properties> = ({
	children,
	className = "",
	to,
}: Properties) => (
	<HashLink className={className} smooth to={to}>
		{children}
	</HashLink>
);

export { Link };
