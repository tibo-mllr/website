module.exports = {
	extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
		project: [
			'./tsconfig.json',
			'./packages/*/tsconfig.json',
			'./apps/*/tsconfig.json',
		],
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'eslint-plugin-import-helpers',
		'eslint-plugin-prettier',
	],
	rules: {
		'prefer-const': 'error',
		'prefer-destructuring': 'warn',
		'import/no-extraneous-dependencies': [
			'off',
			{
				packageDir: ['./packages/shared-types'],
			},
		],
		'import-helpers/order-imports': [
			'warn',
			{
				groups: ['module', ['parent', 'sibling', 'index']],
				alphabetize: { order: 'asc', ignoreCase: true },
			},
		],
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/no-explicit-any': 'error',
	},
	ignorePatterns: [
		'node_modules',
		'dist',
		'build',
		'**/public/*.bundle.js',
		'.git',
	],
	root: true,
};
