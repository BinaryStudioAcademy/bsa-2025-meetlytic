import { Link } from "~/libs/components/components.js";
import { AppRoute, LogoSize, LogoTheme } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	hasLink?: boolean;
	size?: ValueOf<typeof LogoSize>;
	theme?: ValueOf<typeof LogoTheme>;
};

const Logo: React.FC<Properties> = ({
	hasLink = true,
	size = LogoSize.SMALL,
	theme = LogoTheme.LIGHT,
}: Properties) => {
	const logoContent = (
		<span
			className={getValidClassNames(
				styles["logo-text"],
				styles[size],
				styles[theme],
			)}
		>
			Meetlytic
		</span>
	);

	return hasLink ? <Link to={AppRoute.ROOT}>{logoContent}</Link> : logoContent;
};

export { Logo };
