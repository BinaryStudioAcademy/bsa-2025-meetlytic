import {
	LandingBackground,
	LandingCTA,
	LandingFeatures,
	LandingFooter,
	LandingHeader,
	LandingHero,
	LandingTestimonial,
} from "./components/components.js";
import styles from "./styles.module.css";

const Landing: React.FC = () => (
	<div className={styles["landing"]}>
		<LandingBackground />
		<LandingHeader />
		<main className={styles["landing-page"]} role="main">
			<LandingHero />
			<LandingFeatures />
			<LandingTestimonial />
			<LandingCTA />
		</main>
		<LandingFooter />
	</div>
);

export { Landing };
