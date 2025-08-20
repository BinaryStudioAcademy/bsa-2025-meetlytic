import { createListenerMiddleware, isRejected } from "@reduxjs/toolkit";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import {
	type AsyncThunkConfig,
	type RejectPayload,
} from "~/libs/types/types.js";
import { actions as authActions } from "~/modules/auth/auth.js";

const errorListenerMiddleware = createListenerMiddleware<
	AsyncThunkConfig["state"],
	AsyncThunkConfig["dispatch"]
>();

errorListenerMiddleware.startListening({
	effect: async (action, listenerApi) => {
		const { message, status } = action.payload as RejectPayload;

		if (status === HTTPCode.UNAUTHORIZED) {
			notification.error(message ?? "Session expired. Please log in again.");
			await listenerApi.dispatch(authActions.logout());
		}

		notification.error(message ?? "Something went wrong");
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
