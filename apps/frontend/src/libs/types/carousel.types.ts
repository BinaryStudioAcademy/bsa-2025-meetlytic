type UseCarouselProperties = {
	delayMs: number;
	isPaused?: boolean;
	length: number;
};

type UseCarouselResult = {
	index: number;
	setIndex: (value: number) => void;
};

export { type UseCarouselProperties, type UseCarouselResult };
