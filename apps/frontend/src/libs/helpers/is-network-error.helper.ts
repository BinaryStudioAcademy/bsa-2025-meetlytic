const isNetworkError = (error: unknown): boolean => {
	if (typeof error === "object" && error !== null) {
		return (error as { code?: string }).code === "ERR_NETWORK";
	}

	return false;
};

export { isNetworkError };
