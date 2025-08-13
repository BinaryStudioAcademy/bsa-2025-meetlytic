import dayjs from "dayjs";

import { MINUTES_IN_HOUR, ZERO_LENGTH } from "../../constants/constants.js";

const getOffsetHours = (date: Date): string => {
	const offsetMinutes = dayjs(date).utcOffset();
	const offsetHours = offsetMinutes / MINUTES_IN_HOUR;

	return offsetHours > ZERO_LENGTH
		? `+${String(offsetHours)}`
		: String(offsetHours);
};

export { getOffsetHours };
