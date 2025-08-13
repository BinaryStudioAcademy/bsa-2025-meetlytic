import {
	Avatar,
	Button,
	Icon,
	Logo,
	Navigation,
} from "~/libs/components/components.js";
import { NAVIGATION_ITEMS } from "~/libs/constants/constants.js";
import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
	LogoSize,
	LogoTheme,
	LogoType,
} from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useCallback, useLogout, useState } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	const logout = useLogout();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	const toggleMenu = useCallback(() => {
		setMenuOpen((previous) => !previous);
	}, []);

	return (
		<header className={styles["header"]}>
			<div className={styles["header-inner"]}>
				<button
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					className={styles["header__burger"]}
					onClick={toggleMenu}
				>
					<Icon name={menuOpen ? "burgerMenu" : "burgerClose"} />
				</button>

				<div className={styles["header-logo"]}>
					<div className={styles["header-logo-mobile"]}>
						<Logo
							hasLink
							size={LogoSize.SMALL}
							theme={LogoTheme.LIGHT}
							type={LogoType.MOBILE}
						/>
					</div>
					<div className={styles["header-logo-desktop"]}>
						<Logo
							hasLink
							size={LogoSize.SMALL}
							theme={LogoTheme.LIGHT}
							type={LogoType.DESKTOP}
						/>
					</div>
				</div>
				<div className={styles["header__avatar-logout-wrapper"]}>
					<Avatar size={AvatarSize.MOBILE} type={AvatarType.MAIN} />
					<Button
						iconLeft={
							<Icon className={styles["header__logout-icon"]} name="logout" />
						}
						label="Logout"
						onClick={handleLogout}
						size={ButtonSize.SMALL}
						variant={ButtonVariant.OUTLINED}
					/>
				</div>
			</div>

			<div
				className={getValidClassNames(
					styles["header__mobile-menu"],
					menuOpen ? styles["header__mobile-menu--open"] : null,
				)}
			>
				<Navigation items={NAVIGATION_ITEMS} />

				<div className={styles["header__mobile-menu-actions"]}>
					<Button
						iconLeft={
							<Icon className={styles["header__logout-icon"]} name="logout" />
						}
						label="Logout"
						onClick={handleLogout}
						size={ButtonSize.SMALL}
						variant={ButtonVariant.OUTLINED}
					/>
				</div>
			</div>
		</header>
	);
};

export { Header };
