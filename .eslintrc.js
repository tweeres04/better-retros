module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'react-app',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	rules: {
		'@typescript-eslint/indent': 0,
		eqeqeq: 0,
		'no-console': 'warn',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
