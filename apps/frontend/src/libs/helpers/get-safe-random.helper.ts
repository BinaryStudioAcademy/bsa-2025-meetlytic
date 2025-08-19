import { LandingBgNumeric } from "~/modules/landing/landing.js";

const getSafeRandomValue = (): number => {
	const array = new Uint32Array(LandingBgNumeric.UINT32_ARRAY_LENGTH);
	crypto.getRandomValues(array);

	const value = array[LandingBgNumeric.ZERO] ?? LandingBgNumeric.ZERO;

	return value / (LandingBgNumeric.UINT32_MAX + LandingBgNumeric.ONE);
};

export { getSafeRandomValue };
