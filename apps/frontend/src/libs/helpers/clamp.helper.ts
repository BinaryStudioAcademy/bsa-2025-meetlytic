const clamp = (
	value: number,
	minimumValue: number,
	maximumValue: number,
): number => Math.max(minimumValue, Math.min(maximumValue, value));

export { clamp };
