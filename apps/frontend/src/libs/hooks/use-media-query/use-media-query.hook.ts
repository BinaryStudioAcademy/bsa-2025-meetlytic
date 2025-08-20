import { DOMEvent } from "~/libs/enums/enums.js";
import { useEffect, useState } from "~/libs/hooks/hooks.js";

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(
		() => globalThis.matchMedia(query).matches,
	);

	useEffect(() => {
		const mediaQuery = globalThis.matchMedia(query);

		const handler = (event: MediaQueryListEvent): void => {
			setMatches(event.matches);
		};

		setMatches(mediaQuery.matches);

		mediaQuery.addEventListener(DOMEvent.CHANGE, handler);

		return (): void => {
			mediaQuery.removeEventListener(DOMEvent.CHANGE, handler);
		};
	}, [query]);

	return matches;
};

export { useMediaQuery };
