const ExceptionMessage = {
	FAILED_TO_GET_INSTANCE: "Failed to get InstanceId from CloudFormation output",
	FAILED_TO_CREATE_STACK: "Failed to create CloudFormation stack",
	FAILED_TO_DELETE_STACK: "Failed to delete CloudFormation stack",
} as const;

export { ExceptionMessage };
