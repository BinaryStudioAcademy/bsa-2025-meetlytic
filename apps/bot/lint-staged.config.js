import baseConfig from "../../lint-staged.config.js";

/** @type {import('lint-staged').Config} */
const config = {
	...baseConfig,
	"**/*.ts": [
		() => "npm run lint:js -w apps/bot",
		() => "npm run lint:type -w apps/bot",
	],
};

export default config;
