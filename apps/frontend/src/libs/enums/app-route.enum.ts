const AppRoute = {
	ANY: "*",
	FEATURES: "#features",
	MEETINGS: "/meetings",
	MEETINGS_$ID: "/meetings/:id",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AppRoute };
