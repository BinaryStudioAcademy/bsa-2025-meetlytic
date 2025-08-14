const MEMORY_UNIT_SIZE = 1024;

const DEFAULT_MAX_FILES = 1;
const DEFAULT_MAX_FILE_SIZE_MB = 5;
const DEFAULT_MAX_FILE_SIZE =
	DEFAULT_MAX_FILE_SIZE_MB * MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE;

const DEFAULT_ALLOWED_IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

const FILENAME_FALLBACK = "upload";
const FILENAME_SANITIZE_REGEX = /[^\w.-]+/g;

const TO_MB = (bytes: number): string =>
	Math.floor(bytes / (MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE)).toString();

export {
	DEFAULT_ALLOWED_IMAGE_MIME_TYPES,
	DEFAULT_MAX_FILE_SIZE,
	DEFAULT_MAX_FILES,
	FILENAME_FALLBACK,
	FILENAME_SANITIZE_REGEX,
	TO_MB,
};
