import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type Properties = {
	hasLink?: boolean;
};

const Logo: React.FC<Properties> = ({ hasLink = true }: Properties) => {
	const logoContent = <span className={styles["logo-text"]}>Meetlytic</span>;
	return hasLink ? (
		<Link className={styles["logo-link"]} to={AppRoute.ROOT}>
			{logoContent}
		</Link>
	) : (
		logoContent
	);
};

export { Logo };
