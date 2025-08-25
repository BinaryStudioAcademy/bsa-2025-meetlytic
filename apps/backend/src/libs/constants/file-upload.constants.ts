const MAX_FILE_SIZE_MB = 5;

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
	FILENAME_FALLBACK,
	FILENAME_SANITIZE_REGEX,
	MAX_FILE_SIZE_MB,
};
