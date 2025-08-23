import { type RefObject } from "react";

import { useEffect, useRef } from "~/libs/hooks/hooks.js";

const useAutoScroll = <T extends HTMLElement>(
	dependencies: unknown[] = [],
): RefObject<null | T> => {
	const reference = useRef<T>(null);

	useEffect(() => {
		if (reference.current) {
			reference.current.scrollTop = reference.current.scrollHeight;
		}
	}, dependencies);

	return reference;
};

export { useAutoScroll };
