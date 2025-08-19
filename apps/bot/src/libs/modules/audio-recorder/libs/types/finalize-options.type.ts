import { type ValueOf } from "~/libs/types/types.js";

import { type ContentType } from "../enums/enums.js";

type FinalizeOptions = {
	contentType: ValueOf<typeof ContentType>;
	meetingId: string;
	prefix: string;
};

export { type FinalizeOptions };
