module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-react-hooks'],
  extends: [
    '../../.eslintrc.json',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['node_modules', 'out', '*.mjs', '*.cjs', '*.js'],
};
