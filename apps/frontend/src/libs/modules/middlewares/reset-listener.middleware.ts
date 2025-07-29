import { createListenerMiddleware } from "@reduxjs/toolkit";

import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

const resetListenerMiddleware = createListenerMiddleware({ extra: storage });
const startResetListening = resetListenerMiddleware.startListening;

startResetListening({
	effect: async (_action, listenerApi) => {
		await listenerApi.extra.drop(StorageKey.TOKEN);
	},
	type: "store/reset",
});

export { resetListenerMiddleware };
