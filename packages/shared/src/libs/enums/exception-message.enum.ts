const ExceptionMessage = {
	FAILED_TO_GET_INSTANCE: "Failed to get InstanceId from CloudFormation output",
	FAILED_TO_CREATE_STACK: "Failed to create CloudFormation stack",
	FAILED_TO_DELETE_STACK: "Failed to delete CloudFormation stack",
	CANNOT_UPDATE_NON_EXISTENT: "Cannot update non-existent meeting with ID",
	FORBIDDEN: "Access denied",
	MEETING_FAILED_TO_CREATE: "Failed to create a meeting",
	MEETING_NOT_FOUND: "Meeting not found",
	UPDATE_FAILED: "Failed to update meeting",
} as const;

export { ExceptionMessage };
