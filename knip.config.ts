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
		"apps/bot": {
			"ignore": [
				"apps/bot/src/libs/modules/open-ai/open-ai.ts",
				"apps/bot/src/libs/modules/open-ai/base-open-ai.module.ts",
			],
		},
		"apps/frontend": {},
		"packages/shared": {
			includeEntryExports: true,
		},
	},
};

export default config;
