import { type ContentType } from "../../../../libs/enums/enums.js";
import { type ValueOf } from "../../../../libs/types/types.js";

type FilePublicDto = {
	contentType: ValueOf<typeof ContentType>;
	id: number;
	url: string;
};

export { type FilePublicDto };
