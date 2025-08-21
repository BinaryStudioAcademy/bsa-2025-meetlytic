import { getSafeRandomValue } from "../../modules/landing/libs/helpers/helpers.js";

const getRandomInRange = (minimumValue: number, maximumValue: number): number =>
	minimumValue + getSafeRandomValue() * (maximumValue - minimumValue);

export { getRandomInRange };
