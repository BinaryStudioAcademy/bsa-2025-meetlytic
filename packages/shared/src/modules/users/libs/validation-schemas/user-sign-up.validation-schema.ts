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
				message: UserValidationMessage.PASSWORD_REQUIRE,
			}),
		email: z
			.string()
			.trim()
			.min(UserValidationRule.EMAIL_MINIMUM_LENGTH, {
				message: UserValidationMessage.EMAIL_REQUIRE,
			})
			.email({
				message: UserValidationMessage.EMAIL_WRONG,
			}),
		firstName: z
			.string()
			.trim()
			.min(UserValidationRule.FIRST_NAME_MINIMUM_LENGTH, {
				message: UserValidationMessage.FIRST_NAME_MIN_LENGTH,
			})
			.max(UserValidationRule.FIRST_NAME_MAXIMUM_LENGTH, {
				message: UserValidationMessage.FIRST_NAME_MAX_LENGTH,
			}),
		lastName: z
			.string()
			.trim()
			.min(UserValidationRule.LAST_NAME_MINIMUM_LENGTH, {
				message: UserValidationMessage.LAST_NAME_MIN_LENGTH,
			})
			.max(UserValidationRule.LAST_NAME_MAXIMUM_LENGTH, {
				message: UserValidationMessage.LAST_NAME_MAX_LENGTH,
			}),
		password: z
			.string()
			.trim()
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				message: UserValidationMessage.PASSWORD_REQUIRE,
			}),
	})
	.required()
	.refine((data) => data.password === data.confirmPassword, {
		message: UserValidationMessage.PASSWORD_MATCH as string,
		path: ["confirmPassword"],
	});

export { userSignUp };
