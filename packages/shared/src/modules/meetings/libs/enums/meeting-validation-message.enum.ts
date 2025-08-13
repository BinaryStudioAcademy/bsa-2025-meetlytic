const MeetingValidationMessage = {
	HOST_REQUIRE: "Host is required.",
	HOST_WRONG: "This host isn't allowed.",
	OWNER_REQUIRE: "Owner ID must be a positive number.",
	STATUS_WRONG: "This status doesn't exist",
	ZOOM_LINK_INVALID: "Zoom meeting link is invalid",
	ZOOM_LINK_REQUIRE: "Zoom meeting link is required",
} as const;

export { MeetingValidationMessage };
