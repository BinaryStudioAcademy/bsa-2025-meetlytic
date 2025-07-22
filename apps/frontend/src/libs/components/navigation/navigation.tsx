import { type NavigationItem } from "~/libs/types/navigation-item.type.js";

import { NavigationLink } from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties = {
	items: NavigationItem[];
};

const Navigation: React.FC<Properties> = ({ items }: Properties) => (
	<nav>
		<ul className={styles["navigation-list"]}>
			{items.map((item) => (
				<NavigationLink key={item.label} {...item} />
			))}
		</ul>
		;
	</nav>
);

export { Navigation };
