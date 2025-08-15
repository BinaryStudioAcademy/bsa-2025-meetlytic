import { MEMORY_UNIT_SIZE } from "./memory-bytes.constants.js";

const MAX_FILE_SIZE_MB = 5;

const DEFAULT_MAX_FILE_SIZE = {
	MAX_FILE_SIZE_BYTES: MAX_FILE_SIZE_MB * MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE,
	MAX_FILE_SIZE_MB,
	MAX_FILES: 1,
} as const;

const DEFAULT_ALLOWED_IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

const FILENAME_FALLBACK = "upload";
const FILENAME_SANITIZE_REGEX = /[^\w.-]+/g;

export {
	DEFAULT_ALLOWED_IMAGE_MIME_TYPES,
	DEFAULT_MAX_FILE_SIZE,
	FILENAME_FALLBACK,
	FILENAME_SANITIZE_REGEX,
};
