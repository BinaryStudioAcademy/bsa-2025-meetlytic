import { APIPath, AuthApiPath } from "~/libs/enums/enums.js";
import { HTTPMethod } from "~/libs/modules/http/http.js";
import { MeetingsApiPath } from "~/modules/meetings/libs/enums/enums.js";

import { type WhiteRoute } from "./libs/types/types.js";

const WHITE_ROUTES: WhiteRoute[] = [
	{ method: HTTPMethod.POST, path: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}` },
	{ method: HTTPMethod.POST, path: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}` },
	{
		method: HTTPMethod.GET,
		path: new RegExp(
			`^/meetings${MeetingsApiPath.$ID_PUBLIC.replace(":id", "[0-9]+")}\\?token=.+$`,
		),
	},
	{
		method: HTTPMethod.GET,
		path: new RegExp(
			`^/meetings${String(
				MeetingsApiPath.$ID_MEETING_TRANSCRIPTIONS_PUBLIC,
			).replace(":id", "[0-9]+")}\\?token=.+$`,
		),
	},
	{ method: HTTPMethod.GET, path: "/documentation" },
];

export { WHITE_ROUTES };
