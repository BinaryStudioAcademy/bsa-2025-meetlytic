const MeetingValidationMessage = {
	HOST_REQUIRE: "Host is required.",
	HOST_WRONG: "This host isn't allowed.",
	OWNER_REQUIRE: "Owner ID must be a positive number.",
	STATUS_WRONG: "This status doesn't exist",
} as const;

export { MeetingValidationMessage };
