const buildQueryParameters = (
	parameters: Record<string, null | string | undefined>,
): string => {
	const searchParameters = new URLSearchParams();

	for (const [key, value] of Object.entries(parameters)) {
		if (value !== undefined && value !== null && value !== "") {
			searchParameters.set(key, value);
		}
	}

	const queryString = searchParameters.toString();

	return queryString ? `?${queryString}` : "";
};

export { buildQueryParameters };
