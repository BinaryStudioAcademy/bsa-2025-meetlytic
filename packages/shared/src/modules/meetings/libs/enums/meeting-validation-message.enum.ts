import { MeetingValidationRule } from "./meeting-validation-rule.enum.js";

const MeetingValidationMessage = {
	HOST_REQUIRE: "Host is required.",
	HOST_WRONG: "This host isn't allowed.",
	MEETING_TITLE_MAXIMUM_LENGTH: `Meeting title must not exceed ${String(MeetingValidationRule.MEETING_TITLE_MAXIMUM_LENGTH)} characters`,
	OWNER_REQUIRE: "Owner ID must be a positive number.",
	STATUS_WRONG: "This status doesn't exist",
	ZOOM_LINK_INVALID: "Zoom meeting link is invalid",
	ZOOM_LINK_REQUIRE: "Zoom meeting link is required",
} as const;

export { MeetingValidationMessage };
