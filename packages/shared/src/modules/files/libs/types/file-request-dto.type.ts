import { type ContentType } from "../../../../libs/enums/enums.js";
import { type ValueOf } from "../../../../libs/types/types.js";

type FileRequestDto = {
	contentType: ValueOf<typeof ContentType>;
	key: string;
	url: string;
};

export { type FileRequestDto };
