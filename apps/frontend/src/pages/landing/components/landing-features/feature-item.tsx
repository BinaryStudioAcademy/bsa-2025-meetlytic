import { getValidClassNames } from "~/libs/helpers/helpers.js";

import { type Feature } from "../../types/types.js";
import styles from "./styles.module.css";

const FeatureItem: React.FC<Feature> = ({
	eyebrow,
	image,
	reversed,
	text,
	title,
}: Feature) => {
	return (
		<div
			className={getValidClassNames(
				styles["features__item"],
				reversed && styles["features__item--reversed"],
			)}
		>
			<div className={styles["features__content"]}>
				<span className={styles["features__eyebrow"]}>{eyebrow}</span>
				<h3 className={styles["features__item-title"]}>{title}</h3>
				<p className={styles["features__text"]}>{text}</p>
			</div>

			<div className={styles["features__media"]}>
				<div className={styles["features__media-card"]}>
					<img
						alt={image.alt}
						className={styles["features__media-img"]}
						src={image.src}
					/>
				</div>
			</div>
		</div>
	);
};

export { FeatureItem };
