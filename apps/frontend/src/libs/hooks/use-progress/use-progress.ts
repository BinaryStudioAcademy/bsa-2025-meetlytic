import { LoaderProgressConfig } from "~/libs/enums/enums.js";
import { useEffect, useRef, useState } from "~/libs/hooks/hooks.js";

const useProgress = (
	isLoading: boolean,
	step = LoaderProgressConfig.STEP,
	intervalMs = LoaderProgressConfig.INTERVAL_MS,
): number => {
	const [progress, setProgress] = useState<number>(LoaderProgressConfig.START);
	const previousLoadingReference = useRef<boolean | null>(null);

	useEffect(() => {
		let interval: null | ReturnType<typeof setInterval> = null;
		let timeout: null | ReturnType<typeof setTimeout> = null;

		const isFirstMount = previousLoadingReference.current === null;

		if (isLoading) {
			setProgress(LoaderProgressConfig.START);
			interval = setInterval(() => {
				setProgress((p) =>
					p < LoaderProgressConfig.FAKE_LIMIT ? p + step : p,
				);
			}, intervalMs);
		} else {
			if (isFirstMount) {
				setProgress(LoaderProgressConfig.START);
			} else if (previousLoadingReference.current === true) {
				setProgress(LoaderProgressConfig.MAX);
				timeout = setTimeout(() => {
					setProgress(LoaderProgressConfig.START);
				}, LoaderProgressConfig.RESET_DELAY_MS);
			} else {
				setProgress(LoaderProgressConfig.START);
			}
		}

		previousLoadingReference.current = isLoading;

		return (): void => {
			if (interval) {
				clearInterval(interval);
			}

			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [isLoading, step, intervalMs]);

	return progress;
};

export { useProgress };
