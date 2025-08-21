const APIPath = {
	AUTH: "/auth",
	FILES: "/files",
	MEETINGS: "/meetings",
	MEETINGS_$ID: "/meetings/:id",
	PUBLIC_MEETINGS: "/public/meetings",
	USERS: "/users",
} as const;

export { APIPath };
