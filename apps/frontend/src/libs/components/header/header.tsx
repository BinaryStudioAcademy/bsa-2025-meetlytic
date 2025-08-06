import { Avatar, Button, Icon, Logo } from "~/libs/components/components.js";
import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
	LogoSize,
	LogoTheme,
} from "~/libs/enums/enums.js";
import { useCallback, useLogout } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	const logout = useLogout();

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	return (
		<header className={styles["header"]}>
			<div className={styles["header-inner"]}>
				<div className={styles["header-logo"]}>
					<Logo hasLink size={LogoSize.SMALL} theme={LogoTheme.LIGHT} />
				</div>
				<div className={styles["header__avatar-logout-wrapper"]}>
					<Avatar size={AvatarSize.SMALL} type={AvatarType.MAIN} />
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
