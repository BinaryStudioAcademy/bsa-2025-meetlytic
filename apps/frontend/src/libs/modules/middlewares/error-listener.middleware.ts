import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

import { notification } from "~/libs/modules/notifications/notifications.js";

const errorListenerMiddleware = createListenerMiddleware();

errorListenerMiddleware.startListening({
	effect: (action) => {
		const message =
			typeof action.payload === "string"
				? action.payload
				: (action.error.message ?? "Something went wrong");

		notification.error(message);
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
