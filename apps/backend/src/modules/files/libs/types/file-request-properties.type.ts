import { type ValueOf } from "~/libs/types/types.js";

import { type ContentType } from "../enums/enums.js";

type FileRequestProperties = {
	contentType: ValueOf<typeof ContentType>;
	key: string;
	url: string;
};

export { type FileRequestProperties };
