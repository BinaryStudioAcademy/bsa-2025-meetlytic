import { CarouselConfig } from "~/libs/enums/enums.js";
import { useEffect, useState } from "~/libs/hooks/hooks.js";
import {
	type UseCarouselProperties,
	type UseCarouselResult,
} from "~/libs/types/types.js";

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
