import { Avatar, Logo } from "~/libs/components/components.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	return (
		<header className={getValidClassNames(styles["header"])}>
			<div className={getValidClassNames(styles["headerInner"])}>
				<Logo />
				<Avatar />
			</div>
		</header>
	);
};

export { Header };
