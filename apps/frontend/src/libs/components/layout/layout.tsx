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

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const onToggleMenu = useCallback(() => {
		setIsMenuOpen((previous) => !previous);
	}, []);

	const onLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	return (
		<div className={styles["layout"]}>
			<div className={styles["layout__header"]}>
				<Header
					isMenuOpen={isMenuOpen}
					onLogout={onLogout}
					onToggleMenu={onToggleMenu}
				/>
			</div>

			<div className={styles["layout__sidebar"]}>
				<Sidebar>
					<Navigation items={NAVIGATION_ITEMS} />
				</Sidebar>
			</div>

			<main className={styles["layout__main"]}>
				<RouterOutlet />
			</main>

			<MobileMenu
				isOpen={isMenuOpen}
				onClose={onToggleMenu}
				onLogout={onLogout}
			/>
		</div>
	);
};

export { Layout };
