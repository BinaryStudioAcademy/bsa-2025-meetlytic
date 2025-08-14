import ringLarge from "~/assets/img/landing/background/bg-ring-large.svg";
import ringMiddle from "~/assets/img/landing/background/bg-ring-middle.svg";
import ringSmall from "~/assets/img/landing/background/bg-ring-small.svg";
import { LandingBgRingType } from "~/libs/enums/enums.js";
import { initRings } from "~/libs/helpers/helpers.js";
import {
	useEffect,
	useInView,
	useLandingAnimation,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";

import {
	LANDING_BG_INIT,
	LANDING_BG_NUMERIC,
} from "../../constants/constants.js";
import { type RingConfig } from "../../types/types.js";
import styles from "./styles.module.css";

const LandingBackground: React.FC = () => {
	const scope = useRef<HTMLDivElement | null>(null);
	const isInView = useInView(scope, { amount: 0 });
	const [rings, setRings] = useState<RingConfig[]>([]);

	useEffect(() => {
		const root = scope.current;

		if (root && rings.length === LANDING_BG_NUMERIC.ZERO) {
			setRings(initRings({ ringLarge, ringMiddle, ringSmall, root }));
		}
	}, [rings.length]);

	useLandingAnimation(isInView, rings, scope);

	return (
		<div
			aria-hidden="true"
			className={styles["landing-background"]}
			ref={scope}
		>
			{Object.values(LandingBgRingType)
				.filter((v) => typeof v === "string")
				.flatMap((type) =>
					Array.from({ length: LANDING_BG_INIT.RINGS_PER_SIZE }, (_, index) => {
						let source: string;

						switch (type) {
							case LandingBgRingType.LARGE: {
								source = ringLarge;
								break;
							}

							case LandingBgRingType.MIDDLE: {
								source = ringMiddle;
								break;
							}

							default: {
								source = ringSmall;
							}
						}

						return (
							<img
								alt=""
								className={styles["landing__ring"]}
								data-ring={type}
								decoding="async"
								fetchPriority={
									index === LANDING_BG_NUMERIC.ZERO ? "high" : "low"
								}
								key={`${type}-${String(index)}`}
								loading={index === LANDING_BG_NUMERIC.ZERO ? "eager" : "lazy"}
								src={source}
							/>
						);
					}),
				)}
		</div>
	);
};

export { LandingBackground };
