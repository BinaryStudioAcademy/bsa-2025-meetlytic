import { clsx } from "clsx";
import React from "react";

import styles from "./loader.module.css";

type Properties = {
	isLoading: boolean;
	withOverlay?: boolean;
};

const Loader: React.FC<Properties> = ({ isLoading, withOverlay = true }) => {
	if (!isLoading) {
		return null;
	}

	return (
		<div className={withOverlay ? styles["loaderOverlay"] : undefined}>
			<div className={styles["dotLoader"]}>
				<span className={styles["dot"]} />
				<span className={clsx(styles["dot"], styles["dotSecond"])} />
				<span className={clsx(styles["dot"], styles["dotThird"])} />
			</div>
		</div>
	);
};

export { Loader };
