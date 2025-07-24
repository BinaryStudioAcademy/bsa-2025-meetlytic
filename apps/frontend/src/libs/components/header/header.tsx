import { Avatar, Logo } from "~/libs/components/components.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	return (
		<header className={styles["header"]}>
			<div className={styles["header-inner"]}>
				<Logo hasLink={true} />
				<Avatar size="avatar--small" type="avatar--main" />
			</div>
		</header>
	);
};

export { Header };
