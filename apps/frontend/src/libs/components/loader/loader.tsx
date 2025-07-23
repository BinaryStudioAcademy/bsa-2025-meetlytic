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
		<div className={getValidClassNames(withOverlay && styles["loaderOverlay"])}>
			<div className={styles["dotLoader"]}>
				<span className={styles["dot"]} />
				<span
					className={getValidClassNames(styles["dot"], styles["dotSecond"])}
				/>
				<span
					className={getValidClassNames(styles["dot"], styles["dotThird"])}
				/>
			</div>
		</div>
	);
};

export { Loader };
