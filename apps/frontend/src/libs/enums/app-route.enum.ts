const AppRoute = {
	ANY: "*",
	MEETINGS: "/meetings",
	MEETINGS_BY_ID: "/meetings/:id",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AppRoute };
