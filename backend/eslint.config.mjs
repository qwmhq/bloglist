import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		files: ["**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.node,
			},
			ecmaVersion: "latest",
		},
		plugins: {
			"@stylistic/js": stylisticJs,
		},
		rules: {
			eqeqeq: "error",
			"no-console": "off",
			"no-unused-vars": [
				"warn",
				{
					args: "none",
					varsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		ignores: ["dist/**", "build/**"],
	},
];
