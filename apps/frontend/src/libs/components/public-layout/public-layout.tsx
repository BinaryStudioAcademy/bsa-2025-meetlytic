import { Header, RouterOutlet } from "~/libs/components/components.js";

import styles from "./styles.module.css";

const PublicLayout: React.FC = () => {
	return (
		<div className={styles["public"]}>
			<div className={styles["public__header"]}>
				<Header isPublic={true} />
			</div>
			<main className={styles["public__main"]}>
				<RouterOutlet />
			</main>
		</div>
	);
};

export { PublicLayout };
