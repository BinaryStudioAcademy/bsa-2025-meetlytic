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
		const payload = action.payload as RejectPayload | undefined;

		if (payload?.status === HTTPCode.UNAUTHORIZED) {
			await listenerApi.dispatch(authActions.logout());
			notification.error("Session expired. Please log in again.");

			return;
		}

		const errorMessage =
			payload?.message ?? action.error.message ?? "Something went wrong";

		notification.error(errorMessage);
	},
	predicate: isRejected,
});

export { errorListenerMiddleware };
