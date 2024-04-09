module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  plugins: ['react-refresh', 'prettier'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      files: ['*.mdx'],
      parser: 'eslint-mdx',
      parserOptions: {
        extensions: '[*.mdx]',
      },
      settings: {
        'mdx/code-blocks': false,
      },
      extends: ['plugin:react/recommended', 'plugin:mdx/recommended'],
    },
  ],
  rules: {
    'prettier/prettier': 2,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react-hooks/exhaustive-deps': 'off',
    'no-console': 'warn',
  },
};
