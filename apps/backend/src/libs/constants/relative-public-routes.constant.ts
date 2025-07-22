import { APIPath, AuthApiPath } from "@meetlytic/shared";

const RELATIVE_PUBLIC_ROUTES = [
	{ method: "POST", path: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}` },
	{ method: "POST", path: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}` },
];

export { RELATIVE_PUBLIC_ROUTES };
