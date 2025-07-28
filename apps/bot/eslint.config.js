import globals from "globals";

import baseConfig from "../../eslint.config.js";

/** @typedef {import("eslint").Linter.Config} */
let Config;

/** @type {Config} */
const ignoresConfig = {
	ignores: ["build"],
};

/** @type {Config} */
const mainConfig = {
	languageOptions: {
		globals: {
			...globals.node,
			...globals.browser,
		},
	},
};

/** @type {Config[]} */
const config = [...baseConfig, ignoresConfig, mainConfig];

export default config;
