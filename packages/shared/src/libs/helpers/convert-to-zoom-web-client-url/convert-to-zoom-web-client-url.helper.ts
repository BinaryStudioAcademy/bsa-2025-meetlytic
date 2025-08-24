import { ZOOM_JOIN_PATH_REGEX } from "../../constants/constants.js";
import { ZoomPath } from "../../enums/enums.js";

const convertToZoomWebClientUrl = (url: string): string => {
	const parsed = new URL(url);

	if (
		ZOOM_JOIN_PATH_REGEX.test(parsed.pathname) &&
		!parsed.pathname.includes(ZoomPath.WebClient)
	) {
		parsed.pathname = parsed.pathname.replace(
			ZoomPath.Join,
			`${ZoomPath.WebClient}${ZoomPath.WebClientJoinSuffix}`,
		);
	}

	return parsed.toString();
};

export { convertToZoomWebClientUrl };
