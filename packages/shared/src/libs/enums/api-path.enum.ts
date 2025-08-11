const APIPath = {
	AUTH: "/auth",
	MEETINGS: "/meetings",
	PUBLIC_MEETINGS: "/public/meetings",
	MEETINGS_$ID: "/meetings/:id",
	USERS: "/users",
} as const;

export { APIPath };
