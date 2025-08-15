import { UrlProtocol } from "~/libs/enums/enums.js";

const HTTP_REGEX = /^https?:\/\//;

const convertHttpToWs = (origin: string): string => {
	const wsProtocol = origin.startsWith(UrlProtocol.HTTPS)
		? UrlProtocol.WSS
		: UrlProtocol.WS;

	return origin.replace(HTTP_REGEX, wsProtocol);
};

export { convertHttpToWs };
