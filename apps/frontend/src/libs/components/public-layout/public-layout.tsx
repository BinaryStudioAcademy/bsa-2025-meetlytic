import { Header, RouterOutlet } from "~/libs/components/components.js";
import { useCallback, useLogout, useState } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

const PublicLayout: React.FC = () => {
	const logout = useLogout();

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleToggleMenu = useCallback(() => {
		setIsMenuOpen((previous) => !previous);
	}, []);

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	return (
		<div className={styles["public"]}>
			<div className={styles["public__header"]}>
				<Header
					isMenuOpen={isMenuOpen}
					onLogout={handleLogout}
					onToggleMenu={handleToggleMenu}
				/>
			</div>
			<main className={styles["public__main"]}>
				<RouterOutlet />
			</main>
		</div>
	);
};

export { PublicLayout };
