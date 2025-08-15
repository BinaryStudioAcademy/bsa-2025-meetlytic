import { NotificationMessage, ServerErrorType } from "~/libs/enums/enums.js";

type MaybeHTTPError = {
	details?: unknown;
	errorType?: unknown;
	message?: unknown;
	name?: unknown;
	status?: unknown;
};

const isHttpErrorWithResponse = (
	error: unknown,
): error is { response: { data?: { message?: unknown } } } =>
	typeof error === "object" &&
	error !== null &&
	"response" in error &&
	typeof (error as { response: unknown }).response === "object" &&
	(error as { response: unknown }).response !== null;

const isCustomHttpError = (error: unknown): error is MaybeHTTPError =>
	typeof error === "object" &&
	error !== null &&
	("errorType" in error || (error as { name?: unknown }).name === "HTTPError");

const extractErrorMessage = (
	error: unknown,
	fallbackMessage = "Something went wrong",
): string => {
	if (isCustomHttpError(error)) {
		const error_ = error;
		const message =
			typeof error_.message === "string" ? error_.message : undefined;

		if (error_.errorType === ServerErrorType.NO_INTERNET) {
			return message ?? NotificationMessage.NO_INTERNET;
		}

		return message ?? fallbackMessage;
	}

	if (isHttpErrorWithResponse(error)) {
		const maybeMessage = (error.response.data as { message?: string }).message;

		if (typeof maybeMessage === "string" && maybeMessage) {
			return maybeMessage;
		}
	}

	if (typeof error === "string") {
		return error;
	}

	return fallbackMessage;
};

export { extractErrorMessage };
