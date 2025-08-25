const ExceptionMessage = {
	CANNOT_UPDATE_NON_EXISTENT: "Cannot update non-existent meeting with ID",
	FAILED_TO_CREATE_STACK: "Failed to create CloudFormation stack",
	FAILED_TO_DELETE_STACK: "Failed to delete CloudFormation stack",
	FAILED_TO_GET_INSTANCE: "Failed to get InstanceId from CloudFormation output",
	FORBIDDEN: "Access denied",
	MEETING_FAILED_TO_CREATE: "Failed to create a meeting",
	MEETING_NOT_FOUND: "Meeting not found",
	METHOD_NOT_ALLOWED: "Method not allowed for this route",
	ROUTE_NOT_FOUND: "Route not found",
	UPDATE_FAILED: "Failed to update meeting",
} as const;

export { ExceptionMessage };
