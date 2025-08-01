import { type KnipConfig } from "knip";

const config: KnipConfig = {
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.ts"],
	workspaces: {
		".": {
			entry: ["./dangerfile.ts"],
		},
		"apps/backend": {
			entry: ["src/db/migrations/*.ts", "knexfile.ts"],
			ignoreDependencies: ["pg"],
		},
		"apps/bot": {},
		"apps/frontend": {},
		"packages/shared": {
			entry: ["build/index.js"],
			ignore: ["src/**/**"],
			includeEntryExports: true,
		},
	},
};

export default config;
