const PATH_REGEX = /^\/(j|wc\/join)\/(\d{9,11})$/;
const HOST_NAME = "zoom.us";

const isZoomLink = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url);

		if (!parsedUrl.hostname.endsWith(HOST_NAME)) {
			return false;
		}

		const match = PATH_REGEX.exec(parsedUrl.pathname);

		return match !== null;
	} catch {
		return false;
	}
};

export { isZoomLink };
