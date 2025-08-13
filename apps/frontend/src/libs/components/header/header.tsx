import { Avatar, Button, Icon, Logo } from "~/libs/components/components.js";
import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
	LogoSize,
	LogoTheme,
	LogoType,
} from "~/libs/enums/enums.js";
import { useCallback, useLogout, useState } from "~/libs/hooks/hooks.js";

import { MobileMenu } from "./libs/components/mobile-menu/mobile-menu.js";
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
			<div className={styles["header__inner"]}>
				<button
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					className={styles["header__burger"]}
					onClick={toggleMenu}
				>
					<Icon name={menuOpen ? "burgerMenu" : "burgerClose"} />
				</button>

				<div className={styles["header__logo"]}>
					<div className={styles["variable-component__mobile"]}>
						<Logo
							hasLink
							size={LogoSize.SMALL}
							theme={LogoTheme.LIGHT}
							type={LogoType.MOBILE}
						/>
					</div>
					<div className={styles["variable-component__desktop"]}>
						<Logo
							hasLink
							size={LogoSize.SMALL}
							theme={LogoTheme.LIGHT}
							type={LogoType.DESKTOP}
						/>
					</div>
				</div>
				<div className={styles["header__avatar-logout-wrapper"]}>
					<div className={styles["variable-component__mobile"]}>
						<Avatar size={AvatarSize.MOBILE} type={AvatarType.MAIN} />
					</div>
					<div className={styles["variable-component__desktop"]}>
						<Avatar size={AvatarSize.SMALL} type={AvatarType.MAIN} />
					</div>

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

			<MobileMenu
				isOpen={menuOpen}
				onClose={toggleMenu}
				onLogout={handleLogout}
			/>
		</header>
	);
};

export { Header };
