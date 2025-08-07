import dayjs from "dayjs";

import { type DateFormat } from "../types/date-format.js";

const formatDate = (date: Date, format: DateFormat): string => {
	return dayjs(date).format(format);
};

export { formatDate };
