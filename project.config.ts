const ProjectPrefix = {
	APP: "ml",
	CHANGE_TYPES: [
		"build",
		"chore",
		"ci",
		"docs",
		"feat",
		"fix",
		"perf",
		"refactor",
		"revert",
		"style",
		"test",
	],
	ENVIRONMENT: "main",
	ISSUE_PREFIXES: ["ml", "release"],
	SCOPES: {
		APPS: ["frontend", "backend", "bot"],
		PACKAGES: ["main", "shared"],
	},
} as const;

export { ProjectPrefix };
