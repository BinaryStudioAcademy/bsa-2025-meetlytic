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

		mediaQuery.addEventListener("change", handler);

		return (): void => {
			mediaQuery.removeEventListener("change", handler);
		};
	}, [query]);

	return matches;
};

export { useMediaQuery };
