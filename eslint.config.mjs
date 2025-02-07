import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier/recommended';

//TODO: imports
/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'prefer-const': 'error',
      'prefer-destructuring': 'warn',
      'import/no-extraneous-dependencies': [
        'off',
        {
          packageDir: ['./packages/shared-types'],
        },
      ],
      'class-methods-use-this': 'warn',
      'max-classes-per-file': ['error', 1],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  pluginPrettier,
];
