import React from "react";

import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	isLoading: boolean;
	withOverlay?: boolean;
};

const Loader: React.FC<Properties> = ({ isLoading, withOverlay = true }) => {
	if (!isLoading) {
		return null;
	}

	return (
		<div
			className={getValidClassNames(withOverlay && styles["loader-overlay"])}
		>
			<div className={styles["dot-loader"]}>
				<span className={styles["dot"]} />
				<span
					className={getValidClassNames(styles["dot"], styles["dot-second"])}
				/>
				<span
					className={getValidClassNames(styles["dot"], styles["dot-third"])}
				/>
			</div>
		</div>
	);
};

export { Loader };
