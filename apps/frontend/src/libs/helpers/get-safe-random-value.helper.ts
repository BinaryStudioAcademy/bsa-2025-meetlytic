const RandomHelper = {
	ONE: 1,
	UINT32_ARRAY_LENGTH: 1,
	UINT32_MAX: 4_294_967_296,
	ZERO: 0,
};

const getSafeRandomValue = (): number => {
	const array = new Uint32Array(RandomHelper.UINT32_ARRAY_LENGTH);
	crypto.getRandomValues(array);

	const value = array[RandomHelper.ZERO] ?? RandomHelper.ZERO;

	return value / (RandomHelper.UINT32_MAX + RandomHelper.ONE);
};

export { getSafeRandomValue };
