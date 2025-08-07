import dayjs from "dayjs";

import { type DateFormat } from "../../types/types.js";

const formatDate = (date: Date, format: DateFormat): string => {
	return dayjs(date).format(format);
};

export { formatDate };
