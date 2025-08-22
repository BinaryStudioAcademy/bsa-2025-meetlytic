import { CarouselConfig } from "~/libs/enums/enums.js";
import { useEffect, useState } from "~/libs/hooks/hooks.js";

type UseCarouselProperties = {
	delayMs: number;
	isPaused?: boolean;
	length: number;
};

type UseCarouselResult = {
	index: number;
	setIndex: (value: number) => void;
};

const useCarousel = ({
	delayMs,
	isPaused = false,
	length,
}: UseCarouselProperties): UseCarouselResult => {
	const [index, setIndex] = useState<number>(CarouselConfig.INITIAL_INDEX);

	useEffect(() => {
		if (isPaused || length < CarouselConfig.MIN_CAROUSEL_LENGTH) {
			return;
		}

		const intervalId = globalThis.setInterval(() => {
			setIndex((previous) => {
				const nextIndex = (previous + CarouselConfig.INCREMENT) % length;

				return nextIndex < length ? nextIndex : CarouselConfig.INITIAL_INDEX;
			});
		}, delayMs);

		return (): void => {
			globalThis.clearInterval(intervalId);
		};
	}, [delayMs, length, isPaused]);

	return { index, setIndex };
};

export { useCarousel };
