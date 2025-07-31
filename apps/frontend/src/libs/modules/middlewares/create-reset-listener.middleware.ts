import {
	createListenerMiddleware,
	type ListenerMiddlewareInstance,
} from "@reduxjs/toolkit";

import { type Storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { resetStore } from "~/libs/modules/store/actions.js";

const createResetListenerMiddleware = (
	storage: Storage,
): ListenerMiddlewareInstance => {
	const resetListenerMiddleware = createListenerMiddleware({ extra: storage });

	resetListenerMiddleware.startListening({
		effect: async (_action, listenerApi) => {
			await listenerApi.extra.drop(StorageKey.TOKEN);
		},
		type: resetStore.type,
	});

	return resetListenerMiddleware;
};

export { createResetListenerMiddleware };
