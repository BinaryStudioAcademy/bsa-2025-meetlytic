import {
	LandingCTA,
	LandingFeatures,
	LandingFooter,
	LandingHeader,
	LandingHero,
} from "./components/components.js";
import styles from "./styles.module.css";

const LandingPage: React.FC = () => (
	<>
		<LandingHeader />
		<main className={styles["landing-page"]} role="main">
			<LandingHero />
			<LandingFeatures />
			<LandingCTA />
		</main>
		<LandingFooter />
	</>
);

export { LandingPage };
