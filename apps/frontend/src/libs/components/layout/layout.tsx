import {
	Header,
	Navigation,
	RouterOutlet,
	Sidebar,
} from "~/libs/components/components.js";
import { NAVIGATION_ITEMS } from "~/libs/constants/constants.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useCallback, useLogout, useState } from "~/libs/hooks/hooks.js";

import { MobileMenu } from "./libs/components/mobile-menu/mobile-menu.js";
import styles from "./styles.module.css";

const Layout: React.FC = () => {
	const logout = useLogout();

	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = useCallback(() => {
		setMenuOpen((previous) => !previous);
	}, []);

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	return (
		<div
			className={getValidClassNames(
				styles["layout"],
				menuOpen ? styles["layout--no-scroll"] : null,
			)}
		>
			<div className={styles["layout__header"]}>
				<Header
					handleLogout={handleLogout}
					menuOpen={menuOpen}
					toggleMenu={toggleMenu}
				/>
			</div>

			<div className={styles["layout__sidebar"]}>
				<Sidebar>
					<Navigation items={NAVIGATION_ITEMS} />
				</Sidebar>
			</div>

			<main className={styles["layout__main"]}>{<RouterOutlet />}</main>

			<MobileMenu
				isOpen={menuOpen}
				onClose={toggleMenu}
				onLogout={handleLogout}
			/>
		</div>
	);
};

export { Layout };
