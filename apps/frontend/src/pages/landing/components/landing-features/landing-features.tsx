import { FEATURES } from "~/modules/landing/landing.js";

import { FeatureItem } from "./feature-item.js";
import styles from "./styles.module.css";

const LandingFeatures: React.FC = () => {
	return (
		<section
			aria-labelledby="features-title"
			className={styles["features"]}
			id="features"
		>
			<div className={styles["features__container"]}>
				<h2 className={styles["features__title"]} id="features-title">
					Features
				</h2>
				{FEATURES.map((feature) => (
					<FeatureItem key={feature.id} {...feature} />
				))}
			</div>
		</section>
	);
};

export { LandingFeatures };
