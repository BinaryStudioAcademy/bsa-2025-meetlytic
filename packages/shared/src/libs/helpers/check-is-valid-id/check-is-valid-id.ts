const checkIsValidId = (value: number): boolean => {
	return Number.isFinite(value) && Math.abs(value) === value;
};

export { checkIsValidId };
