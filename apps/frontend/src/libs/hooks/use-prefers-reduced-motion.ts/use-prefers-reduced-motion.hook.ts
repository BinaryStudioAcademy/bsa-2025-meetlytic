import { DOMEvent } from "~/libs/enums/enums.js";
import { useEffect, useState } from "~/libs/hooks/hooks.js";

const usePrefersReducedMotion = (): boolean => {
	const [isReduced, setIsReduced] = useState<boolean>(false);

	const PREFERS_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

	useEffect(() => {
		const mediaQuery = globalThis.matchMedia(PREFERS_REDUCED_MOTION_QUERY);

		const update = (): void => {
			setIsReduced(mediaQuery.matches);
		};

		update();

		mediaQuery.addEventListener(DOMEvent.CHANGE, update);

		return (): void => {
			mediaQuery.removeEventListener(DOMEvent.CHANGE, update);
		};
	}, []);

	return isReduced;
};

export { usePrefersReducedMotion };
