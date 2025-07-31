import { APIPath, AuthApiPath } from "~/libs/enums/enums.js";

import { type WhiteRoute } from "./libs/types/types.js";

const WHITE_ROUTES: WhiteRoute[] = [
	{ method: "POST", path: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}` },
	{ method: "POST", path: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}` },

	{ method: "GET", path: "/documentation" },
	{ method: "GET", path: "/documentation/static/swagger-ui.css" },
	{ method: "GET", path: "/documentation/static/index.css" },
	{ method: "GET", path: "/documentation/static/swagger-ui-bundle.js" },
	{
		method: "GET",
		path: "/documentation/static/swagger-ui-standalone-preset.js",
	},
	{
		method: "GET",
		path: "/documentation/static/swagger-initializer.js",
	},
	{ method: "GET", path: "/documentation/json" },
];

export { WHITE_ROUTES };
