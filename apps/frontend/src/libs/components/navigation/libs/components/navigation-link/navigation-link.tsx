import { clsx, Icon, NavLink } from "~/libs/components/components.js";
import { useCallback } from "~/libs/hooks/hooks.js";
import { type NavigationItem as Properties } from "~/libs/types/types.js";

import styles from "./styles.module.css";

const NavigationLink: React.FC<Properties> = ({
	href,
	icon,
	label,
}: Properties) => {
	const getClassName = useCallback(
		({ isActive }: { isActive: boolean }): string => {
			return clsx(styles["navigation-link"], isActive && styles["active"]);
		},
		[],
	);
	return (
		<li>
			<NavLink className={getClassName} key={label} to={href}>
				<>
					<Icon name={icon} />
					<span>{label}</span>
					<Icon
						className={styles["navigation-link-icon-arrow"]}
						name="arrowRight"
					/>
				</>
			</NavLink>
		</li>
	);
};

export { NavigationLink };
