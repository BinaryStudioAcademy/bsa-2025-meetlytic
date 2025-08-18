import { Header, RouterOutlet } from "~/libs/components/components.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

const PublicLayout: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const handleToggleMenu = useCallback(() => {
		setIsMenuOpen((previous) => !previous);
	}, []);

	return (
		<div className={styles["public"]}>
			<div className={styles["public__header"]}>
				<Header isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} />
			</div>
			<main className={styles["public__main"]}>
				<RouterOutlet />
			</main>
		</div>
	);
};

export { PublicLayout };
