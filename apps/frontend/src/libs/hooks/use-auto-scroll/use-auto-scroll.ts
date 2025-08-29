import { type RefObject } from "react";

import { useEffect, useRef } from "~/libs/hooks/hooks.js";

const useAutoScroll = <T extends HTMLElement>(
	dependencies: unknown[] = [],
): RefObject<null | T> => {
	const SMOOTH = "smooth";
	const END = "end";
	const reference = useRef<T>(null);

	useEffect(() => {
		if (reference.current) {
			reference.current.scrollIntoView({
				behavior: SMOOTH,
				block: END,
			});
		}
	}, dependencies);

	return reference;
};

export { useAutoScroll };
