import logoIcon from "~/assets/img/logo/meetlytic-icon.svg";
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
		<div
			className={getValidClassNames(styles["logo"], styles[`logo--${size}`])}
		>
			<img
				alt="Meetlytic Icon"
				className={getValidClassNames(
					styles["logo__icon"],
					styles[`logo__icon--${size}`],
				)}
				src={logoIcon}
			/>
			<span
				className={getValidClassNames(
					styles["logo__text"],
					styles[`logo__text--${size}`],
					styles[`logo__text--${theme}`],
				)}
			>
				Meetlytic
			</span>
		</div>
	);

	return hasLink ? <Link to={AppRoute.ROOT}>{logoContent}</Link> : logoContent;
};

export { Logo };
