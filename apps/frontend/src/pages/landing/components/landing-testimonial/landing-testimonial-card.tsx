import { type Testimonial } from "~/modules/landing/landing.js";

import styles from "./styles.module.css";

type Properties = { testimonial: Testimonial };

const LandingTestimonialCard: React.FC<Properties> = ({
	testimonial,
}: Properties) => {
	return (
		<figure className={styles["testimonial-card"]}>
			<blockquote className={styles["testimonial-card__message"]}>
				{testimonial.text}
			</blockquote>

			<div className={styles["testimonial-card__avatar-container"]}>
				<span className={styles["testimonial-card__avatar-wrap"]}>
					<img
						alt={testimonial.authorName}
						className={styles["testimonial-card__avatar"]}
						src={testimonial.authorAvatarSrc}
					/>
				</span>
			</div>

			<figcaption className={styles["testimonial-card__author"]}>
				<strong className={styles["testimonial-card__name"]}>
					{testimonial.authorName}
				</strong>
				<span className={styles["testimonial-card__position"]}>
					{testimonial.authorPosition}
				</span>
			</figcaption>
		</figure>
	);
};

export { LandingTestimonialCard };
