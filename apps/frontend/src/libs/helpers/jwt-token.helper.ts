import { StorageKey } from "~/libs/modules/storage/libs/enums/enums.js";
import { storage } from "~/libs/modules/storage/storage.js";

const jwtTokenHelper = {
	async get(): Promise<null | string> {
		return await storage.get(StorageKey.TOKEN);
	},

	async has(): Promise<boolean> {
		return await storage.has(StorageKey.TOKEN);
	},

	async remove(): Promise<void> {
		await storage.drop(StorageKey.TOKEN);
	},

	async save(token: string): Promise<void> {
		await storage.set(StorageKey.TOKEN, token);
	},
};

export { jwtTokenHelper };
