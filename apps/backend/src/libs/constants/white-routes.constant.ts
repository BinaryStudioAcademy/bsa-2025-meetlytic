import { APIPath, AuthApiPath } from "~/libs/enums/enums.js";
import { HTTPMethod } from "~/libs/modules/http/http.js";

import { type WhiteRoute } from "./libs/types/types.js";

const WHITE_ROUTES: WhiteRoute[] = [
	{ method: HTTPMethod.POST, path: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}` },
	{ method: HTTPMethod.POST, path: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}` },
	{
		method: HTTPMethod.GET,
		path: /\/meetings\/[1-9]+\/url-verification\?token=.*/,
	},
	{ method: HTTPMethod.GET, path: "/documentation" },
];

export { WHITE_ROUTES };
