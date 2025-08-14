import { z } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";

type UserSignUpRequestValidationDto = {
	confirmPassword: z.ZodString;
	email: z.ZodString;
	firstName: z.ZodString;
	lastName: z.ZodString;
	password: z.ZodString;
};

const userSignUp = z
	.object<UserSignUpRequestValidationDto>({
		confirmPassword: z
			.string()
			.trim()
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				message: UserValidationMessage.PASSWORD_RANGE,
			})
			.max(UserValidationRule.PASSWORD_MAXIMUM_LENGTH, {
				message: UserValidationMessage.PASSWORD_RANGE,
			}),
		email: z
			.string()
			.trim()
			.toLowerCase()
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
		password: z
			.string()
			.trim()
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				message: UserValidationMessage.PASSWORD_RANGE,
			})
			.max(UserValidationRule.PASSWORD_MAXIMUM_LENGTH, {
				message: UserValidationMessage.PASSWORD_RANGE,
			}),
	})
	.required()
	.refine((data) => data.password === data.confirmPassword, {
		message: UserValidationMessage.PASSWORD_MATCH as string,
		path: ["confirmPassword"],
	});

export { userSignUp };
