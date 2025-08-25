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
	const [touchStart, setTouchStart] = useState<null | number>(null);

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

	const handleTouchStart = useCallback(
		(event: React.TouchEvent<HTMLElement>) => {
			const firstTouch =
				event.touches[LandingTestimonialConfig.INITIAL_TOUCH_INDEX];

			if (firstTouch) {
				setTouchStart(firstTouch.clientX);
			}
		},
		[],
	);

	const handleTouchEnd = useCallback(
		(event: React.TouchEvent<HTMLElement>) => {
			const firstChangedTouch =
				event.changedTouches[LandingTestimonialConfig.INITIAL_TOUCH_INDEX];

			if (touchStart === null || !firstChangedTouch) {
				return;
			}

			const touchEnd = firstChangedTouch.clientX;
			const swipeDistance = touchEnd - touchStart;

			if (swipeDistance > LandingTestimonialConfig.TOUCH_SWIPE_THRESHOLD) {
				const previousIndex =
					(index +
						LandingTestimonialConfig.PREVIOUS_INDEX_INCREMENT +
						items.length) %
					items.length;
				setIndex(previousIndex);
			} else if (
				swipeDistance < -LandingTestimonialConfig.TOUCH_SWIPE_THRESHOLD
			) {
				const nextIndex =
					(index + LandingTestimonialConfig.NEXT_INDEX_INCREMENT) %
					items.length;
				setIndex(nextIndex);
			}

			setTouchStart(null);
		},
		[index, items.length, setIndex, touchStart],
	);

	return (
		<section
			aria-live="polite"
			aria-roledescription="carousel"
			className={styles["testimonials"]}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onTouchEnd={handleTouchEnd}
			onTouchStart={handleTouchStart}
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
