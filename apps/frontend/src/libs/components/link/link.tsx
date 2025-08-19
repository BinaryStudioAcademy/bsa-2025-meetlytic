import { NavLink } from "~/libs/components/components.js";
import { type AppRoute, type LandingSection } from "~/libs/enums/enums.js";
import { useCallback } from "~/libs/hooks/hooks.js";
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
}: Properties) => {
	const handleClick = useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
		(event) => {
			if (globalThis.location.hash === to && to.startsWith("#")) {
				const element = document.querySelector(to);
				element?.scrollIntoView();
				event.preventDefault();
			}
		},
		[to],
	);

	return (
		<NavLink className={className} onClick={handleClick} to={to}>
			{children}
		</NavLink>
	);
};

export { Link };
