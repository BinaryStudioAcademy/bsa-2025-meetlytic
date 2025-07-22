const UserValidationMessage = {
	EMAIL_REQUIRE: "Email is required",
	EMAIL_WRONG: "Email is wrong",
	FIRST_NAME_MAX_LENGTH: "First name must not exceed 50 characters",
	FIRST_NAME_MIN_LENGTH: "First name must be at least 1 character long",
	FIRST_NAME_REQUIRE: "First name is required",
	LAST_NAME_MAX_LENGTH: "Last name must not exceed 50 characters",
	LAST_NAME_MIN_LENGTH: "Last name must be at least 1 character long",
	LAST_NAME_REQUIRE: "Last name is required",
} as const;

export { UserValidationMessage };
