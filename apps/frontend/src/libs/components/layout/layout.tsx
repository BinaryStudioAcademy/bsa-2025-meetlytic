import {
	Header,
	Navigation,
	RouterOutlet,
	Sidebar,
} from "~/libs/components/components.js";
import { NAVIGATION_ITEMS } from "~/libs/constants/constants.js";

import styles from "./styles.module.css";

const Layout: React.FC = () => {
	return (
		<div className={styles["layout"]}>
			<div className={styles["layout__header"]}>
				<Header />
			</div>

			<div className={styles["layout__sidebar"]}>
				<Sidebar>
					<Navigation items={NAVIGATION_ITEMS} />
				</Sidebar>
			</div>

			<main className={styles["layout__main"]}>
				<RouterOutlet />
			</main>
		</div>
	);
};

export { Layout };
