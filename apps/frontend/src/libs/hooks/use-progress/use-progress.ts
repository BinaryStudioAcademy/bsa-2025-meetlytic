import { ProgressConfig } from "~/libs/enums/enums.js";
import { useEffect, useRef, useState } from "~/libs/hooks/hooks.js";

const useProgress = (
	isLoading: boolean,
	step = ProgressConfig.STEP,
	intervalMs = ProgressConfig.INTERVAL_MS,
): number => {
	const [progress, setProgress] = useState<number>(ProgressConfig.START);
	const previousLoadingReference = useRef<boolean | null>(null);

	useEffect(() => {
		let interval: null | ReturnType<typeof setInterval> = null;
		let timeout: null | ReturnType<typeof setTimeout> = null;

		const isFirstMount = previousLoadingReference.current === null;

		if (isLoading) {
			setProgress(ProgressConfig.START);
			interval = setInterval(() => {
				setProgress((p) => (p < ProgressConfig.FAKE_LIMIT ? p + step : p));
			}, intervalMs);
		} else {
			if (isFirstMount) {
				setProgress(ProgressConfig.START);
			} else if (previousLoadingReference.current === true) {
				setProgress(ProgressConfig.MAX);
				timeout = setTimeout(() => {
					setProgress(ProgressConfig.START);
				}, ProgressConfig.RESET_DELAY_MS);
			} else {
				setProgress(ProgressConfig.START);
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
