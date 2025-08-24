const FileErrorMessage = {
	CONTENT_TYPE: "Content-Type must be multipart/form-data",
	DELETE_FAILED: "Failed to delete file",
	NOT_FOUND: "File was not found",
	REQUIRED: "File is required",
	UPDATE_FAILED: "Failed to update file",
} as const;

export { FileErrorMessage };
