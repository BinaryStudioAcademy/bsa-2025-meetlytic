import { z } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";

type UserSignInRequestValidationDto = {
	email: z.ZodString;
	password: z.ZodString;
};

const userSignIn = z
	.object<UserSignInRequestValidationDto>({
		email: z
			.string()
			.trim()
			.min(UserValidationRule.EMAIL_MINIMUM_LENGTH, {
				message: UserValidationMessage.EMAIL_REQUIRE,
			})
			.email({
				message: UserValidationMessage.EMAIL_WRONG,
			}),
		password: z
			.string()
			.trim()
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				message: UserValidationMessage.PASSWORD_REQUIRE,
			}),
	})
	.required();

export { userSignIn };
