import { type LinkGroup } from "../../types/types.js";
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
						<a
							aria-label={label}
							className={styles["landing-footer__link"]}
							href={to}
						>
							{label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export { FooterColumn };
