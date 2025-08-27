import { TrackDuration, TrackStringPadding } from "~/libs/enums/enums.js";

const formatDuration = (seconds: number): string => {
	const hours = Math.floor(seconds / TrackDuration.SECONDS_PER_HOUR);
	const minutes = Math.floor(
		(seconds % TrackDuration.SECONDS_PER_HOUR) /
			TrackDuration.SECONDS_PER_MINUTE,
	);
	const remainingSeconds = Math.floor(
		seconds % TrackDuration.SECONDS_PER_MINUTE,
	);

	const formattedHours = String(hours).padStart(
		TrackStringPadding.PADDING_LENGTH,
		TrackStringPadding.PADDING_CHARACTER,
	);
	const formattedMinutes = String(minutes).padStart(
		TrackStringPadding.PADDING_LENGTH,
		TrackStringPadding.PADDING_CHARACTER,
	);
	const formattedSeconds = String(remainingSeconds).padStart(
		TrackStringPadding.PADDING_LENGTH,
		TrackStringPadding.PADDING_CHARACTER,
	);

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export { formatDuration };
