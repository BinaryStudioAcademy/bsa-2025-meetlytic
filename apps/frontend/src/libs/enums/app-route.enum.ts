const AppRoute = {
	ANY: "*",
	FEATURES: "#features",
	MEETINGS: "/meetings",
	MEETINGS_$ID: "/meetings/:id",
	PROFILE: "/profile",
	ROOT: "/",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AppRoute };
