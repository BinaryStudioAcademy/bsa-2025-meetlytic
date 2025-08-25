import { ZOOM_ERROR_REGEX } from "../../constants/constants.js";

const isZoomLinkValid = (html: string): boolean => {
	return !ZOOM_ERROR_REGEX.test(html);
};

export { isZoomLinkValid };
