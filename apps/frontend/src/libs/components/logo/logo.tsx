import logoDark from "~/assets/img/logo/meetlytic-logo-dark.svg";
import logoLight from "~/assets/img/logo/meetlytic-logo.svg";
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
	const logoSource = theme === LogoTheme.DARK ? logoDark : logoLight;

	const logoContent = (
		<div className={styles["logo"]}>
			<img
				alt="Meetlytic Logo"
				className={getValidClassNames(
					styles["logo__image"],
					styles[`logo__image--${size}`],
				)}
				src={logoSource}
			/>
		</div>
	);

	return hasLink ? <Link to={AppRoute.ROOT}>{logoContent}</Link> : logoContent;
};

export { Logo };
