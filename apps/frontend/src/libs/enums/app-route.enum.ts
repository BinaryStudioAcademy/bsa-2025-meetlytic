const AppRoute = {
	ANY: "*",
	MEETINGS: "/meetings",
	MEETINGS_BY_ID: "/meetings/:id",
	PUBLIC_MEETINGS_BY_ID: "/public/meetings/:id",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AppRoute };
