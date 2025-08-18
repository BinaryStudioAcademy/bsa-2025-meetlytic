import { z } from "zod";

import { MeetingErrorMessage, MeetingValidationRule } from "../enums/enums.js";

const searchInputValidationSchema = z.object({
	search: z.string().trim().min(MeetingValidationRule.SEARCH_MINIMUM_LENGTH, {
		message: MeetingErrorMessage.SEARCH_NOT_EMPTY,
	}),
});

export { searchInputValidationSchema };
