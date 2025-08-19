import { z } from "zod";

import { ContentType } from "../../../../libs/enums/enums.js";
import { type ValueOf } from "../../../../libs/types/types.js";
import { FileValidationMessage } from "../enums/enums.js";

const allowedContentTypes = Object.values(ContentType);

const fileUpdate = z
	.object({
		contentType: z
			.string()
			.nonempty(FileValidationMessage.CONTENT_TYPE_REQUIRE)
			.refine(
				(value: string): boolean =>
					allowedContentTypes.includes(value as ValueOf<typeof ContentType>),
				{
					message: FileValidationMessage.CONTENT_TYPE_WRONG,
				},
			),
		key: z.string().nonempty(FileValidationMessage.KEY_REQUIRE).url(),
		url: z.string().nonempty(FileValidationMessage.URL_REQUIRE).url(),
	})
	.required();

export { fileUpdate };
