import { createListenerMiddleware } from "@reduxjs/toolkit";

import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { storeReset } from "~/libs/modules/store/actions.js";

const resetListenerMiddleware = createListenerMiddleware({ extra: storage });

resetListenerMiddleware.startListening({
	effect: async (_action, listenerApi) => {
		await listenerApi.extra.drop(StorageKey.TOKEN);
	},
	type: storeReset.type,
});

export { resetListenerMiddleware };
