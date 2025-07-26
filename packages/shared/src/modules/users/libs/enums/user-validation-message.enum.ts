import { UserValidationRule } from "./user-validation-rule.enum.js";

const UserValidationMessage = {
	EMAIL_REQUIRE: "Email is required",
	EMAIL_WRONG: "Email is wrong",
	FIRST_NAME_MAX_LENGTH: `First name must not exceed ${String(UserValidationRule.FIRST_NAME_MAXIMUM_LENGTH)} characters`,
	FIRST_NAME_MIN_LENGTH: `First name must be at least ${String(UserValidationRule.FIRST_NAME_MINIMUM_LENGTH)} character long`,
	FIRST_NAME_REQUIRE: "First name is required",
	LAST_NAME_MAX_LENGTH: `Last name must not exceed ${String(UserValidationRule.LAST_NAME_MAXIMUM_LENGTH)} characters`,
	LAST_NAME_MIN_LENGTH: `Last name must be at least ${String(UserValidationRule.LAST_NAME_MINIMUM_LENGTH)} character long`,
	LAST_NAME_REQUIRE: "Last name is required",
	PASSWORD_MATCH: "Passwords do not match",
	PASSWORD_REQUIRE: "Password is required",
} as const;

export { UserValidationMessage };
