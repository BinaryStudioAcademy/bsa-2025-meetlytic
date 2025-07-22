import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

import { showToast } from "~/libs/modules/notifications/notifications.js";

const errorListenerMiddleware = createListenerMiddleware();

errorListenerMiddleware.startListening({
	effect: (action) => {
		const message = action.error.message ?? "Something went wrong";

		showToast(message, "error");
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
