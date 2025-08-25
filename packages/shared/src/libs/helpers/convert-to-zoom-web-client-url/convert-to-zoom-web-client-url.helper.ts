import { ZOOM_JOIN_PATH_REGEX } from "../../constants/constants.js";
import { ZoomPath } from "../../enums/enums.js";

const convertToZoomWebClientUrl = (url: string): string => {
	const parsed = new URL(url);

	if (
		ZOOM_JOIN_PATH_REGEX.test(parsed.pathname) &&
		!parsed.pathname.includes(ZoomPath.WEB_CLIENT)
	) {
		parsed.pathname = parsed.pathname.replace(
			ZoomPath.JOIN,
			`${ZoomPath.WEB_CLIENT}${ZoomPath.WEB_CLIENT_JOIN_SUFFIX}`,
		);
	}

	return parsed.toString();
};

export { convertToZoomWebClientUrl };
