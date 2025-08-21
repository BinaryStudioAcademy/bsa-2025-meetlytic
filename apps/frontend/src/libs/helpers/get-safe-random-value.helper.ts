const RANDOM_HELPER_CONST = {
	ONE: 1,
	UINT32_ARRAY_LENGTH: 1,
	UINT32_MAX: 4_294_967_296,
	ZERO: 0,
};

const getSafeRandomValue = (): number => {
	const array = new Uint32Array(RANDOM_HELPER_CONST.UINT32_ARRAY_LENGTH);
	crypto.getRandomValues(array);

	const value = array[RANDOM_HELPER_CONST.ZERO] ?? RANDOM_HELPER_CONST.ZERO;

	return value / (RANDOM_HELPER_CONST.UINT32_MAX + RANDOM_HELPER_CONST.ONE);
};

export { getSafeRandomValue };
