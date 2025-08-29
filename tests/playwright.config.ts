/* eslint-disable import/no-default-export */
import { defineConfig, devices } from "@playwright/test";

const RETRIES_ON_CI = 2;
const NO_RETRIES = 0;
const WORKERS_ON_CI = 1;
const WORKERS_LOCAL = 4;

export default defineConfig({
	forbidOnly: !!process.env["CI"],
	fullyParallel: true,
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	reporter: "html",
	retries: process.env["CI"] ? RETRIES_ON_CI : NO_RETRIES,
	testDir: "./tests",
	use: {
		baseURL: "http://localhost:3000/",
		trace: "on-first-retry",
	},
	workers: process.env["CI"] ? WORKERS_ON_CI : WORKERS_LOCAL,
});
