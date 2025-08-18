import { FeatureAnimation } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import {
	useInViewAnimation,
	usePrefersReducedMotion,
	useRef,
} from "~/libs/hooks/hooks.js";
import { type Feature } from "~/modules/landing/landing.js";

import styles from "./styles.module.css";

const FeatureItem: React.FC<Feature> = ({
	eyebrow,
	image,
	isReversed,
	text,
	title,
}: Feature) => {
	const rootReference = useRef<HTMLDivElement | null>(null);
	const reduced = usePrefersReducedMotion();

	useInViewAnimation({
		final: {
			opacity: "1",
			transform: "translateX(0px)",
		},
		initial: {
			opacity: "0",
			transform: `translateX(${(isReversed ? -FeatureAnimation.OFFSET_PX : FeatureAnimation.OFFSET_PX).toString()}px)`,
		},
		isDisabled: reduced,
		ref: rootReference as React.RefObject<HTMLElement>,
	});

	return (
		<div
			className={getValidClassNames(
				styles["features__item"],
				isReversed && styles["features__item--isReversed"],
			)}
			ref={rootReference}
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
