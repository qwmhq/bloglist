module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 0,
    'indent': [
      'error',
      2,
    ],
    'react/jsx-indent': [
      'error',
      2
    ],
    'semi': [
      'error',
      'always'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true },
    ],
  },
}
