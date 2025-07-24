import { Avatar, Logo } from "~/libs/components/components.js";
import { AvatarSize } from "~/libs/enums/avatar-size.enum.js";
import { AvatarType } from "~/libs/enums/avatar-type.enum.js";
import { LogoSize } from "~/libs/enums/logo-size.enum.js";
import { LogoTheme } from "~/libs/enums/logo-theme.enum.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	return (
		<header className={styles["header"]}>
			<div className={styles["header-inner"]}>
				<Logo hasLink size={LogoSize.SMALL} theme={LogoTheme.LIGHT} />
				<Avatar size={AvatarSize.SMALL} type={AvatarType.MAIN} />
			</div>
		</header>
	);
};

export { Header };
