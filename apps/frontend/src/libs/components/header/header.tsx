import { Avatar, Logo } from "~/libs/components/components.js";
import {
	AvatarSize,
	AvatarType,
	LogoSize,
	LogoTheme,
} from "~/libs/enums/enums.js";

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
