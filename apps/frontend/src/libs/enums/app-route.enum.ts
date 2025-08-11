const AppRoute = {
	ANY: "*",
	MEETINGS: "/meetings",
	MEETINGS_$ID: "/meetings/:id",
	PUBLIC_MEETINGS_$ID: "public/meetings/:id",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AppRoute };
