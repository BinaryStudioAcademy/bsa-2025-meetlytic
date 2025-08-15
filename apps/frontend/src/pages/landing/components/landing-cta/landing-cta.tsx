import { Button, Link } from "~/libs/components/components.js";
import { AppRoute, ButtonSize, ButtonVariant } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

const LandingCTA: React.FC = () => {
	return (
		<section aria-labelledby="cta-title" className={styles["cta"]}>
			<div className={styles["cta__inner"]}>
				<h2 className={styles["cta__title"]} id="cta-title">
					Ready to Ignite Your Business <br /> Journey?
				</h2>

				<Link to={AppRoute.SIGN_IN}>
					<Button
						className={styles["cta__button"]}
						label="Get Started"
						size={ButtonSize.DEFAULT}
						variant={ButtonVariant.PRIMARY}
					/>
				</Link>
			</div>
		</section>
	);
};

export { LandingCTA };
