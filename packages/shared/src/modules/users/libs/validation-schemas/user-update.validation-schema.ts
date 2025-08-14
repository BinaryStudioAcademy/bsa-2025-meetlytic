import { z } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";

type UserUpdateRequestValidationDto = {
	email: z.ZodString;
	firstName: z.ZodString;
	lastName: z.ZodString;
};

const userUpdate = z
	.object<UserUpdateRequestValidationDto>({
		email: z
			.string()
			.trim()
			.min(UserValidationRule.EMAIL_MINIMUM_LENGTH, {
				message: UserValidationMessage.EMAIL_REQUIRE,
			})
			.email({
				message: UserValidationMessage.EMAIL_INVALID,
			}),
		firstName: z
			.string()
			.trim()
			.min(UserValidationRule.FIRST_NAME_MINIMUM_LENGTH, {
				message: UserValidationMessage.FIRST_NAME_MIN_LENGTH,
			})
			.max(UserValidationRule.FIRST_NAME_MAXIMUM_LENGTH, {
				message: UserValidationMessage.FIRST_NAME_MAX_LENGTH,
			})
			.regex(UserValidationRule.NAME_VALIDATION_REGEX, {
				message: UserValidationMessage.ONLY_LATIN_LETTERS,
			}),
		lastName: z
			.string()
			.trim()
			.min(UserValidationRule.LAST_NAME_MINIMUM_LENGTH, {
				message: UserValidationMessage.LAST_NAME_MIN_LENGTH,
			})
			.max(UserValidationRule.LAST_NAME_MAXIMUM_LENGTH, {
				message: UserValidationMessage.LAST_NAME_MAX_LENGTH,
			})
			.regex(UserValidationRule.NAME_VALIDATION_REGEX, {
				message: UserValidationMessage.ONLY_LATIN_LETTERS,
			}),
	})
	.required();

export { userUpdate };
