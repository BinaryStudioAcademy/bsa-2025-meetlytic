import { LoaderProgressConfig } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useProgress } from "~/libs/hooks/hooks.js";

import { CircularProgress } from "./libs/comnponents/circular-progress/circular-progress.js";
import styles from "./styles.module.css";

type Properties = {
	hasOverlay?: boolean;
	isLoading: boolean;
	loaderClassName?: string;
};

const Loader: React.FC<Properties> = ({
	hasOverlay = false,
	isLoading,
	loaderClassName,
}: Properties) => {
	const progress = useProgress(isLoading);

	if (!isLoading && progress === LoaderProgressConfig.START) {
		return null;
	}

	return (
		<div className={getValidClassNames(hasOverlay && styles["loader-overlay"])}>
			<div
				className={getValidClassNames(
					styles["loader"],
					isLoading && styles["loader--pending"],
					loaderClassName,
				)}
			>
				<div
					className={getValidClassNames(
						styles["loader__square"],
						styles["loader__square--top"],
					)}
				/>
				<div
					className={getValidClassNames(
						styles["loader__square"],
						styles["loader__square--bottom"],
					)}
				/>
				<div
					className={getValidClassNames(
						styles["loader__square"],
						styles["loader__square--left"],
					)}
				/>
				<CircularProgress progress={progress} radius={53} />
			</div>
		</div>
	);
};

export { Loader };
