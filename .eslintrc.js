module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	plugins: ['react-hooks'],
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
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'no-mixed-spaces-and-tabs': 0,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
