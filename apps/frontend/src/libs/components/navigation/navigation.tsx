import { type NavigationItem } from "~/libs/types/navigation-item.type.js";

import { NavigationLink } from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties = {
	items: NavigationItem[];
	onClick?: () => void;
};

const Navigation: React.FC<Properties> = ({ items, onClick }: Properties) => (
	<nav>
		<ul className={styles["navigation-list"]}>
			{items.map((item) => (
				<NavigationLink key={item.label} {...item} onClick={onClick} />
			))}
		</ul>
	</nav>
);

export { Navigation };
