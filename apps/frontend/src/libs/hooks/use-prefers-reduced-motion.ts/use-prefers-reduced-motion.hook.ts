import { DomEvent } from "~/libs/enums/enums.js";
import { useEffect, useState } from "~/libs/hooks/hooks.js";

const usePrefersReducedMotion = (): boolean => {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const mediaQuery = globalThis.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);

		const update = (): void => {
			setReduced(mediaQuery.matches);
		};

		update();

		mediaQuery.addEventListener(DomEvent.CHANGE, update);

		return (): void => {
			mediaQuery.removeEventListener(DomEvent.CHANGE, update);
		};
	}, []);

	return reduced;
};

export { usePrefersReducedMotion };
