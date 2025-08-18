const isPositiveNumber = (value: number): boolean => {
	return Number.isFinite(value) && Math.abs(value) === value;
};

export { isPositiveNumber };
