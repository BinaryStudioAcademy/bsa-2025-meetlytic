import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

import { notification } from "~/libs/modules/notifications/notifications.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import { actions as authActions } from "~/modules/auth/auth.js";

const errorListenerMiddleware = createListenerMiddleware<
	AsyncThunkConfig["state"],
	AsyncThunkConfig["dispatch"]
>();

errorListenerMiddleware.startListening({
	effect: async (action, listenerApi) => {
		const message =
			typeof action.payload === "string"
				? action.payload
				: (action.error.message ?? "Something went wrong");

		notification.error(message);

		if (action.error.message === "Invalid credentials") {
			await listenerApi.dispatch(authActions.logout());
		}
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
