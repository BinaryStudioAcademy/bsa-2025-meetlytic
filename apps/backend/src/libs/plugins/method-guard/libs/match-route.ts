import { match } from "path-to-regexp";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants.js";

function matchRoute(
	url: string,
	method: string,
	allRoutes: { method: string; path: string }[],
): { isMethodAllowed: boolean; isRouteFound: boolean } {
	const matchingRoutes = allRoutes.filter((route) =>
		match(route.path, { decode: decodeURIComponent })(url),
	);

	const isRouteFound = matchingRoutes.length > EMPTY_ARRAY_LENGTH;
	const isMethodAllowed = matchingRoutes.some(
		(route) => route.method.toUpperCase() === method.toUpperCase(),
	);

	return { isMethodAllowed, isRouteFound };
}

export { matchRoute };
