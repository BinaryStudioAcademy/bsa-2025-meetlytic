import {
	Header,
	Navigation,
	RouterOutlet,
	Sidebar,
} from "~/libs/components/components.js";
import { NAVIGATION_ITEMS } from "~/libs/constants/constants.js";
import { useCallback, useLogout, useState } from "~/libs/hooks/hooks.js";

import { MobileMenu } from "./libs/components/mobile-menu/mobile-menu.js";
import styles from "./styles.module.css";

const Layout: React.FC = () => {
	const logout = useLogout();

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const handleToggleMenu = useCallback(() => {
		setIsMenuOpen((previous) => !previous);
	}, []);

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	return (
		<div className={styles["layout"]}>
			<div className={styles["layout__header"]}>
				<Header
					isMenuOpen={isMenuOpen}
					onLogout={handleLogout}
					onToggleMenu={handleToggleMenu}
				/>
			</div>

			<div className={styles["layout__sidebar"]}>
				<Sidebar>
					<Navigation items={NAVIGATION_ITEMS} />
				</Sidebar>
			</div>

			<main className={styles["layout__main"]}>
				<div className={styles["main-container"]}>
					<RouterOutlet />
				</div>
			</main>

			<MobileMenu
				isOpen={isMenuOpen}
				onClose={handleToggleMenu}
				onLogout={handleLogout}
			/>
		</div>
	);
};

export { Layout };
