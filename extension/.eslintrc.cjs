/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': 'warn'
  },
  ignorePatterns: ['.eslintrc.cjs', 'dist/']
}
