import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	withLink?: boolean;
};

const Logo: React.FC<Properties> = ({ withLink = true }: Properties) => {
	const logoContent = (
		<span className={getValidClassNames(styles["logoText"])}>LOGO</span>
	);

	return withLink ? (
		<Link className={getValidClassNames(styles["logoLink"])} to={AppRoute.ROOT}>
			{logoContent}
		</Link>
	) : (
		logoContent
	);
};

export { Logo };
