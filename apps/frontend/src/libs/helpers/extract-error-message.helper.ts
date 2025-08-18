const extractErrorMessage = (
	error: unknown,
	fallbackMessage = "Something went wrong",
): string => {
	if (typeof error === "object" && error !== null) {
		const errorMessage = (error as { message?: unknown }).message;

		if (typeof errorMessage === "string") {
			return errorMessage;
		}

		const maybeResponse = (error as { response?: unknown }).response;

		if (
			typeof maybeResponse === "object" &&
			maybeResponse !== null &&
			"data" in maybeResponse &&
			typeof (maybeResponse as { data?: unknown }).data === "object"
		) {
			const maybeMessage = (maybeResponse as { data: { message?: unknown } })
				.data.message;

			if (typeof maybeMessage === "string") {
				return maybeMessage;
			}
		}
	}

	return fallbackMessage;
};

export { extractErrorMessage };
