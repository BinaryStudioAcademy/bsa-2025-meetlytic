const PSEUDO_RANDOM_CONSTANTS = {
	INCREMENT: 49_297,
	MODULUS: 233_280,
	MULTIPLIER: 9301,
};

const createSeededRandom = (seed: number): (() => number) => {
	let value: number = seed;

	return () => {
		value =
			(value * PSEUDO_RANDOM_CONSTANTS.MULTIPLIER +
				PSEUDO_RANDOM_CONSTANTS.INCREMENT) %
			PSEUDO_RANDOM_CONSTANTS.MODULUS;

		return value / PSEUDO_RANDOM_CONSTANTS.MODULUS;
	};
};

export { createSeededRandom };
