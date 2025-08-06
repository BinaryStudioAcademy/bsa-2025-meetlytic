import dayjs from "dayjs";

const formatDate = (date: Date, format: string): string => {
	return dayjs(date).format(format);
};

export { formatDate };
