import {
	LandingFooter,
	LandingHeader,
	LandingHero,
} from "./components/components.js";
import styles from "./styles.module.css";

const LandingPage: React.FC = () => (
	<main className={styles["landing-page"]} role="main">
		<LandingHeader />
		<LandingHero />
		<LandingFooter />
	</main>
);

export { LandingPage };
