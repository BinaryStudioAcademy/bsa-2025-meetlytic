const clamp = (value: number, minValue: number, maxValue: number): number =>
	Math.max(minValue, Math.min(maxValue, value));

export { clamp };
