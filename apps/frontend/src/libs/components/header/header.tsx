import { Avatar, Logo } from "~/libs/components/components.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	return (
		<header className={styles["header"]}>
			<div className={styles["headerInner"]}>
				<Logo hasLink={true} />
				<Avatar size="avatarSmall" type="avatarMain" />
			</div>
		</header>
	);
};

export { Header };
