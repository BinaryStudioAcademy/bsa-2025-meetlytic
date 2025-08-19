import { getSafeRandomValue } from "./helpers.js";

const getRandomInRange = (minimumValue: number, maximumValue: number): number =>
	minimumValue + getSafeRandomValue() * (maximumValue - minimumValue);

export { getRandomInRange };
