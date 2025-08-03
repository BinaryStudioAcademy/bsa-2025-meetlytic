import baseConfig from "../../lint-staged.config.js";

/** @type {import('lint-staged').Config} */
const config = {
	...baseConfig,
	"**/*.ts": [
		() => "npm run lint:js -w packages/shared-node",
		() => "npm run lint:type -w packages/shared-node",
	],
};

export default config;
