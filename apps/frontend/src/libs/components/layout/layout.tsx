import { Header, Navigation, Sidebar } from "~/libs/components/components.js";
import { NAVIGATION_ITEMS } from "~/libs/constants/constants.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
};

const Layout: React.FC<Properties> = ({ children }: Properties) => {
	return (
		<div className={styles["layout"]}>
			<Header />
			<div className={styles["layout__body"]}>
				<Sidebar>
					<Navigation items={NAVIGATION_ITEMS} />
				</Sidebar>
				<main className={styles["layout__main"]}>{children}</main>
			</div>
		</div>
	);
};

export { Layout };
