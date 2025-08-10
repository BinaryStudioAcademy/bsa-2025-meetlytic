import { Button, Link, Logo } from "~/libs/components/components.js";
import {
	AppRoute,
	ButtonSize,
	ButtonVariant,
	LogoSize,
	LogoTheme,
} from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import { HEADER_LINKS } from "../navigation-links.js";
import styles from "./styles.module.css";

type Properties = { className?: string };

const LandingHeader: React.FC<Properties> = ({ className }: Properties) => {
	return (
		<header className={getValidClassNames(styles["landing-header"], className)}>
			<div className={styles["landing-header__inner"]}>
				<div className={styles["landing-header__left"]}>
					<div className={styles["landing-header__logo"]}>
						<Logo hasLink size={LogoSize.SMALL} theme={LogoTheme.LIGHT} />
					</div>

					<nav
						aria-label="Header navigation"
						className={styles["landing-header__nav"]}
					>
						<ul className={styles["landing-header__nav-list"]}>
							{HEADER_LINKS.map(({ label, to }) => (
								<li className={styles["landing-header__nav-item"]} key={label}>
									<Link
										aria-label={label}
										className={styles["landing-header__nav-link"]}
										to={to}
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className={styles["landing-header__actions"]}>
					<Link to={AppRoute.SIGN_IN}>
						<Button
							className={styles["landing-header__button"]}
							label="Log In"
							size={ButtonSize.DEFAULT}
							variant={ButtonVariant.OUTLINED}
						/>
					</Link>
					<Link to={AppRoute.SIGN_UP}>
						<Button
							className={styles["landing-header__button"]}
							label="Sign Up"
							size={ButtonSize.DEFAULT}
							variant={ButtonVariant.PRIMARY}
						/>
					</Link>
				</div>
			</div>
		</header>
	);
};

export { LandingHeader };
