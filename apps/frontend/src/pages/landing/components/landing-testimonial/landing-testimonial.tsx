import { Button } from "~/libs/components/components.js";
import { LandingTestimonialConfig } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useCallback, useCarousel, useState } from "~/libs/hooks/hooks.js";
import { type Testimonial, TESTIMONIALS } from "~/modules/landing/landing.js";

import { LandingTestimonialCard } from "./landing-testimonial-card.js";
import styles from "./styles.module.css";

type Properties = {
	autoplayDelayMs?: number;
	items?: Testimonial[];
};

const LandingTestimonial: React.FC<Properties> = ({
	autoplayDelayMs = LandingTestimonialConfig.AUTOPLAY_DELAY_MS,
	items = TESTIMONIALS,
}: Properties) => {
	const [isPaused, setIsPaused] = useState<boolean>(false);

	const { index, setIndex } = useCarousel({
		delayMs: autoplayDelayMs,
		isPaused,
		length: items.length,
	}) as { index: number; setIndex: (nextIndex: number) => void };

	const handleMouseEnter = useCallback(() => {
		setIsPaused(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsPaused(false);
	}, []);

	const handleDotClick = useCallback(
		(dotIndex: number) => {
			setIndex(dotIndex);
		},
		[setIndex],
	);

	const handleDotClickWrapper = useCallback(
		(index_: number): (() => void) => {
			return () => {
				handleDotClick(index_);
			};
		},
		[handleDotClick],
	);

	return (
		<section
			aria-live="polite"
			aria-roledescription="carousel"
			className={styles["testimonials"]}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className={styles["testimonials__inner"]}>
				<div aria-hidden="true" className={styles["testimonials__quote"]} />

				<div className={styles["testimonials__viewport"]}>
					<div
						className={getValidClassNames(
							styles["testimonials__track"],
							styles[`testimonials__track--pos-${String(index)}`],
						)}
					>
						{items.map((item) => (
							<div className={styles["testimonials__slide"]} key={item.id}>
								<LandingTestimonialCard testimonial={item} />
							</div>
						))}
					</div>
				</div>

				<ul className={styles["testimonials__dots"]} role="tablist">
					{items.map((item, itemIndex) => {
						const isActive = itemIndex === index;

						return (
							<li className={styles["testimonials__dot-item"]} key={item.id}>
								<Button
									aria-label={`Show testimonial ${item.authorName}`}
									aria-selected={isActive}
									className={
										isActive
											? styles["testimonials__dot--active"]
											: styles["testimonials__dot"]
									}
									hasVisuallyHiddenLabel
									label={`Show testimonial ${item.authorName}`}
									onClick={handleDotClickWrapper(itemIndex)}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
};

export { LandingTestimonial };
