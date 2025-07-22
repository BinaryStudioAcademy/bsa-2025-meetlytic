import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

import { showToast } from "~/libs/helpers/toast.js";

const errorListenerMiddleware = createListenerMiddleware();

errorListenerMiddleware.startListening({
	effect: (action) => {
		const message =
			(typeof action.error.message === "string" && action.error.message) ||
			"Something went wrong";

		showToast(message, "error");
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
