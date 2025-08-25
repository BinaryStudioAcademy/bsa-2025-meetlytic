import { match } from "path-to-regexp";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants.js";

function matchRoute(
	url: string,
	method: string,
	allRoutes: { method: string; path: string }[],
): { found: boolean; methodAllowed: boolean } {
	const matchingRoutes = allRoutes.filter((route) =>
		match(route.path, { decode: decodeURIComponent })(url),
	);

	const found = matchingRoutes.length > EMPTY_ARRAY_LENGTH;
	const methodAllowed = matchingRoutes.some(
		(route) => route.method.toUpperCase() === method.toUpperCase(),
	);

	return { found, methodAllowed };
}

export { matchRoute };
