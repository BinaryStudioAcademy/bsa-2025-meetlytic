import { APIPath, AuthApiPath } from "@meetlytic/shared";

import { type WhiteRoute } from "./libs/types/types.js";

const WHITE_ROUTES: WhiteRoute[] = [
	{ method: "POST", path: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}` },
	{ method: "POST", path: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}` },
];

export { WHITE_ROUTES };
