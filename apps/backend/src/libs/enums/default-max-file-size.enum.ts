import { MAX_FILE_SIZE_MB, MEMORY_UNIT_SIZE } from "../constants/constants.js";

const DefaultMaxFileSize = {
	MAX_FILE_SIZE_BYTES: MAX_FILE_SIZE_MB * MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE,
	MAX_FILE_SIZE_MB,
	MAX_FILES: 1,
} as const;

export { DefaultMaxFileSize };
