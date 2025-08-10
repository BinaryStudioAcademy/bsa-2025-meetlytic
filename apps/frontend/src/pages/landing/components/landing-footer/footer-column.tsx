import { Link } from "~/libs/components/components.js";

import { type LinkGroup } from "../navigation-links.js";
import styles from "./styles.module.css";

type Properties = {
	group: LinkGroup;
};

const FooterColumn: React.FC<Properties> = ({ group }: Properties) => {
	return (
		<div className={styles["landing-footer__column"]}>
			<h3 className={styles["landing-footer__title"]}>{group.title}</h3>
			<ul className={styles["landing-footer__list"]}>
				{group.links.map(({ label, to }) => (
					<li className={styles["landing-footer__item"]} key={label}>
						<Link className={styles["landing-footer__link"]} to={to}>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export { FooterColumn };
