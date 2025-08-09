import { ProgressConfig } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useProgress } from "~/libs/hooks/hooks.js";

import { CircularProgress } from "./libs/comnponents/circular-progress/circular-progress.js";
import styles from "./styles.module.css";

type Properties = {
	isLoading: boolean;
	loaderClassName?: string;
	withOverlay?: boolean;
};

const Loader: React.FC<Properties> = ({
	isLoading,
	loaderClassName,
	withOverlay = false,
}: Properties) => {
	const progress = useProgress(isLoading);

	if (!isLoading && progress === ProgressConfig.START) {
		return null;
	}

	return (
		<div
			className={getValidClassNames(withOverlay && styles["loader-overlay"])}
		>
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
