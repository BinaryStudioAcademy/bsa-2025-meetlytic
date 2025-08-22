const UploadErrorMessage = {
	FILE_TOO_LARGE: (maxMB: number) => `File too large. Max ${String(maxMB)} MB`,
	INVALID_FILE_TYPE: (mime: string, allowed: readonly string[]) =>
		`Invalid file type "${mime}". Allowed: ${allowed.join(", ")}`,

	MISSING_FILE_FIELD: (fieldName: string) =>
		`Missing file field "${fieldName}"`,
} as const;

export { UploadErrorMessage };
