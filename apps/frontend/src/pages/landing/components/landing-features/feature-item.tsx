import { animate, getValidClassNames, inView } from "~/libs/helpers/helpers.js";
import { useEffect, useRef, useState } from "~/libs/hooks/hooks.js";
import { type Feature } from "~/modules/landing/libs/types/types.js";

import styles from "./styles.module.css";

const usePrefersReducedMotion = (): boolean => {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mediaQuery = globalThis.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);

		const updateReducedMotion = (): void => {
			setReduced(mediaQuery.matches);
		};

		updateReducedMotion();
		mediaQuery.addEventListener("change", updateReducedMotion);

		return (): void => {
			mediaQuery.removeEventListener("change", updateReducedMotion);
		};
	}, []);

	return reduced;
};

const FeatureItem: React.FC<Feature> = ({
	eyebrow,
	image,
	isReversed,
	text,
	title,
}: Feature) => {
	const rootReference = useRef<HTMLDivElement | null>(null);
	const reduced = usePrefersReducedMotion();

	useEffect(() => {
		const element = rootReference.current as HTMLElement;

		element.style.opacity = "0";
		element.style.transform = `translateX(${isReversed ? "-28px" : "28px"})`;

		const unsubscribeInView = inView(
			element,
			() => {
				animate(
					element,
					{ opacity: 1, transform: "translateX(0px)" },
					{ duration: 0.6 },
				);

				return (): void => {
					unsubscribeInView();
				};
			},
			{ amount: 0.25, margin: "0px 0px -15% 0px" },
		);

		return unsubscribeInView;
	}, [isReversed, reduced]);

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
