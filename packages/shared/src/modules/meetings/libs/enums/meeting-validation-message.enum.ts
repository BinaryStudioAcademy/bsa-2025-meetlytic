import { MeetingValidationRule } from "./meeting-validation-rule.enum.js";

const MeetingValidationMessage = {
	HOST_REQUIRE: "Host is required.",
	HOST_WRONG: "This host isn't allowed.",
	MEETING_ID_MUST_BE_INTEGER: "Meeting ID must be an integer.",
	MEETING_ID_MUST_BE_NUMBER:
		"Invalid meeting ID format. Please enter a valid number.",
	MEETING_ID_MUST_BE_POSITIVE: "Meeting ID must be a positive number.",
	MEETING_ID_TOO_LARGE:
		"The meeting ID entered is invalid. Please check the ID and try again.",
	MEETING_TITLE_MAXIMUM_LENGTH: `Meeting title must not exceed ${String(MeetingValidationRule.MEETING_TITLE_MAXIMUM_LENGTH)} characters`,
	OWNER_REQUIRE: "Owner ID must be a positive number.",
	STATUS_WRONG: "This status doesn't exist",
	ZOOM_LINK_INVALID: "Zoom meeting link is invalid",
	ZOOM_LINK_REQUIRE: "Zoom meeting link is required",
} as const;

export { MeetingValidationMessage };
