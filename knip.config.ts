import { type KnipConfig } from "knip";

const config: KnipConfig = {
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.js"],
	workspaces: {
		".": {
			entry: ["./dangerfile.ts"],
			"playwright-test": {
				config: "./tests/playwright.config.ts",
				entry: ["./tests/tests/**/*.spec.ts"],
			},
		},
		"apps/backend": {
			entry: ["src/db/migrations/*.ts", "knexfile.ts"],
			ignoreDependencies: ["pg"],
		},
		"apps/bot": {},
		"apps/frontend": {},
		"packages/shared": {},
	},
};

export default config;
