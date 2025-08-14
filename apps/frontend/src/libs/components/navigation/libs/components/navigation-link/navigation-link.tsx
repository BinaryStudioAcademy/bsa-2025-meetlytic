import { Icon, NavLink } from "~/libs/components/components.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useCallback } from "~/libs/hooks/hooks.js";
import { type NavigationItem } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = NavigationItem & {
	onClick: (() => void) | undefined;
};

const NavigationLink: React.FC<Properties> = ({
	href,
	icon,
	label,
	onClick,
}: Properties) => {
	const getClassName = useCallback(
		({ isActive }: { isActive: boolean }): string => {
			return getValidClassNames(
				styles["navigation-link"],
				isActive && styles["active"],
			);
		},
		[],
	);

	return (
		<li>
			<NavLink className={getClassName} key={label} onClick={onClick} to={href}>
				<>
					<Icon name={icon} />
					<span>{label}</span>
					<div className={styles["hide-on-mobile"]}>
						<Icon
							className={styles["navigation-link-icon-arrow"]}
							name="arrowRight"
						/>
					</div>
				</>
			</NavLink>
		</li>
	);
};

export { NavigationLink };
