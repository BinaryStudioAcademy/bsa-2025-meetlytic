const AppRoute = {
	ANY: "*",
	MEETING_DETAILS: "/meetings/:id",
	MEETINGS: "/meetings",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AppRoute };
