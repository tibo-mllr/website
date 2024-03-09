module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: ['../../.eslintrc.json'],
  root: true,
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['*.dto.ts'],
      rules: {
        'max-classes-per-file': 'off',
      },
    },
  ],
};
