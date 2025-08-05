import logoIcon from "~/assets/img/logo/meetlytic-icon.svg";
import { Link } from "~/libs/components/components.js";
import { AppRoute, LogoSize } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	hasLink?: boolean;
	size?: ValueOf<typeof LogoSize>;
};

const LogoIcon: React.FC<Properties> = ({
	hasLink = true,
	size = LogoSize.SMALL,
}: Properties) => {
	const logoIconContent = (
		<img
			alt="Meetlytic Icon"
			className={getValidClassNames(
				styles["logo-icon"],
				styles[`logo-icon--${size}`],
			)}
			src={logoIcon}
		/>
	);

	return hasLink ? (
		<Link to={AppRoute.ROOT}>{logoIconContent}</Link>
	) : (
		logoIconContent
	);
};

export { LogoIcon };
