import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

import { toast } from "~/libs/modules/notifications/notifications.js";

const errorListenerMiddleware = createListenerMiddleware();

errorListenerMiddleware.startListening({
	effect: (action) => {
		const message = action.error.message ?? "Something went wrong";

		toast.show(message, "error");
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
