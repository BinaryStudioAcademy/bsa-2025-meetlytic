import { type ContentType } from "../../../../libs/enums/enums.js";
import { type ValueOf } from "../../../../libs/types/types.js";

type FileResponseDto = {
	contentType: ValueOf<typeof ContentType>;
	createdAt: string;
	id: number;
	key: string;
	updatedAt: string;
	url: string;
};

export { type FileResponseDto };
