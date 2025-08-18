import { safeRandom } from "./helpers.js";

const randInRange = (minValue: number, maxValue: number): number =>
	minValue + safeRandom() * (maxValue - minValue);

export { randInRange };
