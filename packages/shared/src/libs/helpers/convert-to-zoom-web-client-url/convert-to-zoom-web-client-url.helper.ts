import { ZOOM_JOIN_PATH_REGEX } from "../../constants/constants.js";
import { ZoomPath } from "../../enums/enums.js";

const convertToZoomWebClientUrl = (url: string): string => {
	const parsedUrl = new URL(url);

	if (
		ZOOM_JOIN_PATH_REGEX.test(parsedUrl.pathname) &&
		!parsedUrl.pathname.includes(ZoomPath.WEB_CLIENT)
	) {
		parsedUrl.pathname = parsedUrl.pathname.replace(
			ZoomPath.JOIN,
			`${ZoomPath.WEB_CLIENT}${ZoomPath.WEB_CLIENT_JOIN_SUFFIX}`,
		);
	}

	return parsedUrl.toString();
};

export { convertToZoomWebClientUrl };
