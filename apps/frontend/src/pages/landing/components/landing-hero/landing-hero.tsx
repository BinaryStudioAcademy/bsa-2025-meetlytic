import transcriptImg from "~/assets/img/landing/meeting/meeting-transcript.png";
import videoGridImg from "~/assets/img/landing/meeting/meeting-video-grid.png";
import waitingModalImg from "~/assets/img/landing/meeting/meeting-waiting-modal.png";
import { Button, Link } from "~/libs/components/components.js";
import { AppRoute, ButtonSize, ButtonVariant } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = { className?: string };

const LandingHero: React.FC<Properties> = ({ className }: Properties) => {
	return (
		<section className={getValidClassNames(styles["hero"], className)}>
			<div className={styles["hero__inner"]}>
				<div className={styles["hero__content"]}>
					<h1 className={styles["hero__title"]}>
						We Take Your <br /> Meeting Notes. You Run The Show.
					</h1>
					<p className={styles["hero__subtitle"]}>
						App your sales &amp; product development — accelerate like never
						before with AI agents that know your business.
					</p>
					<Link to={AppRoute.SIGN_UP}>
						<Button
							className={styles["hero__button"]}
							label="Get Started"
							size={ButtonSize.DEFAULT}
							variant={ButtonVariant.PRIMARY}
						/>
					</Link>
				</div>

				<div className={styles["hero__media"]}>
					<img
						alt="Meeting video grid"
						className={styles["hero__img--video"]}
						src={videoGridImg}
					/>
					<img
						alt="Meeting transcript"
						className={styles["hero__img--transcript"]}
						src={transcriptImg}
					/>
					<img
						alt="Waiting modal"
						className={styles["hero__img--waiting"]}
						src={waitingModalImg}
					/>
				</div>
			</div>
		</section>
	);
};

export { LandingHero };
