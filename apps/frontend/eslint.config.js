import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
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
			JSX: true,
			React: true,
		},
	},
};

/** @type {Config} */
const reactConfig = {
	files: ["**/*.tsx"],
	plugins: {
		react,
	},
	rules: {
		...react.configs["jsx-runtime"].rules,
		...react.configs["recommended"].rules,
		"react/jsx-no-bind": ["error", { ignoreRefs: true }],
		"react/react-in-jsx-scope": ["off"],
	},
};

/** @type {Config} */
const reactHooksConfig = {
	files: ["**/*.tsx"],
	plugins: {
		"react-hooks": reactHooks,
	},
	rules: reactHooks.configs.recommended.rules,
};

/** @type {Config} */
const jsxA11yConfig = {
	files: ["**/*.tsx"],
	plugins: {
		"jsx-a11y": jsxA11y,
	},
	rules: jsxA11y.configs.recommended.rules,
};

/** @type {Config[]} */
const overridesConfigs = [
	{
		files: ["vite.config.ts"],
		rules: {
			"import/no-default-export": ["off"],
		},
	},
	{
		files: ["src/vite-env.d.ts"],
		rules: {
			"unicorn/prevent-abbreviations": ["off"],
		},
	},
];

/** @type {Config[]} */
const config = [
	...baseConfig,
	ignoresConfig,
	mainConfig,
	reactConfig,
	reactHooksConfig,
	jsxA11yConfig,
	...overridesConfigs,
];

export default config;
