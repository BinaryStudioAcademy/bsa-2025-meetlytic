import { getSafeRandomValue } from "~/modules/landing/landing.js";

const getRandomInRange = (minimumValue: number, maximumValue: number): number =>
	minimumValue + getSafeRandomValue() * (maximumValue - minimumValue);

export { getRandomInRange };
