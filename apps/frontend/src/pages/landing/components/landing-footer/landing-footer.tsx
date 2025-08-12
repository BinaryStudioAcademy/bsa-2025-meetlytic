import { Link, Logo } from "~/libs/components/components.js";
import { AppRoute, LogoSize, LogoTheme } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import {
	ABOUT_LINKS,
	COMPANY_LINKS,
	CONTACT_LINKS,
} from "../../constants/constants.js";
import { FooterColumn } from "./footer-column.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string;
};

const LandingFooter: React.FC<Properties> = ({ className }: Properties) => {
	const year = new Date().getFullYear();

	return (
		<footer className={getValidClassNames(styles["landing-footer"], className)}>
			<div className={styles["landing-footer__inner"]}>
				<div aria-label="Brand" className={styles["landing-footer__brand"]}>
					<Logo hasLink size={LogoSize.SMALL} theme={LogoTheme.LIGHT} />
				</div>

				<nav
					aria-label="Footer navigation"
					className={styles["landing-footer__columns"]}
				>
					<FooterColumn group={COMPANY_LINKS} />
					<FooterColumn group={CONTACT_LINKS} />
					<FooterColumn group={ABOUT_LINKS} />
				</nav>
			</div>

			<div className={styles["landing-footer__bottom"]}>
				<p className={styles["landing-footer__copyright"]}>
					Copyright © {year}{" "}
					<Link className={styles["landing-footer__link"]} to={AppRoute.ROOT}>
						Meetlytic
					</Link>
				</p>
			</div>
		</footer>
	);
};

export { LandingFooter };
