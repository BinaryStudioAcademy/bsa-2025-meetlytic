import React from "react";

import { ProgressConfig } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type Properties = {
	progress: number;
	radius: number;
};

const CircularProgress: React.FC<Properties> = ({ progress, radius }) => {
	const circumference =
		ProgressConfig.CIRCLE_RADIUS_MULTIPLIER * Math.PI * radius;
	const offset =
		circumference *
		(ProgressConfig.PERCENT_DIVISOR - progress / ProgressConfig.MAX);

	return (
		<div aria-valuenow={progress} className={styles["progress"]}>
			<svg className={styles["ring"]} viewBox="0 0 120 120">
				<circle className={styles["ring__track"]} cx="60" cy="60" r={radius} />
				<circle
					className={styles["ring__bar"]}
					cx="60"
					cy="60"
					r={radius}
					style={{
						strokeDasharray: `${circumference.toString()} ${circumference.toString()}`,
						strokeDashoffset: offset,
					}}
				/>
			</svg>
		</div>
	);
};

export { CircularProgress };
