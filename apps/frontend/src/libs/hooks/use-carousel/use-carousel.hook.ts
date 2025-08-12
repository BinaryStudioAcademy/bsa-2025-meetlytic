import { useEffect, useState } from "~/libs/hooks/hooks.js";

type UseCarouselProperties = {
	delayMs: number;
	isPaused?: boolean;
	length: number;
};

const INCREMENT = 1;
const INITIAL_INDEX = 0;
const MIN_CAROUSEL_LENGTH = 2;

const useCarousel = ({
	delayMs,
	isPaused = false,
	length,
}: UseCarouselProperties): {
	index: number;
	setIndex: (value: number) => void;
} => {
	const [index, setIndex] = useState(INITIAL_INDEX);

	useEffect(() => {
		if (index >= length) {
			setIndex(INITIAL_INDEX);
		}
	}, [length, index]);

	useEffect(() => {
		if (isPaused || length < MIN_CAROUSEL_LENGTH) {
			return;
		}

		const id = globalThis.setInterval(() => {
			setIndex((previous) => (previous + INCREMENT) % length);
		}, delayMs);

		return (): void => {
			globalThis.clearInterval(id);
		};
	}, [delayMs, length, isPaused]);

	return { index, setIndex };
};

export { useCarousel };
