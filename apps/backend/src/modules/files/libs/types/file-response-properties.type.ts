import { type ValueOf } from "~/libs/types/types.js";

import { type ContentType } from "../enums/enums.js";

type FileResponseProperties = {
	contentType: ValueOf<typeof ContentType>;
	createdAt: string;
	id: number;
	key: string;
	updatedAt: string;
	url: string;
};

export { type FileResponseProperties };
