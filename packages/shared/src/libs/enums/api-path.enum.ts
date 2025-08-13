const APIPath = {
	AUTH: "/auth",
	MEETINGS: "/meetings",
	MEETINGS_$ID: "/meetings/:id",
	PUBLIC_MEETINGS: "/public/meetings",
	USERS: "/users",
} as const;

export { APIPath };
