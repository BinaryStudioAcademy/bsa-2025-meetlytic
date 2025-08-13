import { CarouselConfig } from "~/libs/enums/enums.js";
import { useEffect, useState } from "~/libs/hooks/hooks.js";

type UseCarouselProperties = {
	delayMs: number;
	isPaused?: boolean;
	length: number;
};

const useCarousel = ({
	delayMs,
	isPaused = false,
	length,
}: UseCarouselProperties): {
	index: number;
	setIndex: (value: number) => void;
} => {
	const [index, setIndex] = useState<number>(CarouselConfig.INITIAL_INDEX);

	useEffect(() => {
		if (index >= length) {
			setIndex(CarouselConfig.INITIAL_INDEX);
		}
	}, [length, index]);

	useEffect(() => {
		if (isPaused || length < CarouselConfig.MIN_CAROUSEL_LENGTH) {
			return;
		}

		const id = globalThis.setInterval(() => {
			setIndex((previous) => (previous + CarouselConfig.INCREMENT) % length);
		}, delayMs);

		return (): void => {
			globalThis.clearInterval(id);
		};
	}, [delayMs, length, isPaused]);

	return { index, setIndex };
};

export { useCarousel };
