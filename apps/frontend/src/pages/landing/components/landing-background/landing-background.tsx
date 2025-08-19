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
	LandingBgInit,
	LandingBgNumeric,
	type RingConfig,
} from "~/modules/landing/landing.js";

import styles from "./styles.module.css";

const LandingBackground: React.FC = () => {
	const scope = useRef<HTMLDivElement | null>(null);
	const isInView = useInView(scope, {
		amount: LandingBgInit.INITIAL_VIEW_AMOUNT,
	});
	const [rings, setRings] = useState<RingConfig[]>([]);

	useEffect(() => {
		const root = scope.current;

		if (root && rings.length === LandingBgNumeric.ZERO) {
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
				.filter((enumValue) => typeof enumValue === "string")
				.flatMap((type) =>
					Array.from({ length: LandingBgInit.RINGS_PER_SIZE }, (_, index) => {
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
								alt={`Background ring ${type}`}
								className={styles["landing__ring"]}
								data-ring={type}
								decoding="async"
								fetchPriority={index === LandingBgNumeric.ZERO ? "high" : "low"}
								key={`${type}-${String(index)}`}
								loading={index === LandingBgNumeric.ZERO ? "eager" : "lazy"}
								src={source}
							/>
						);
					}),
				)}
		</div>
	);
};

export { LandingBackground };
