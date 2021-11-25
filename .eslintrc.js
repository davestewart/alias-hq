module.exports = {
  root: true,
  env: {
    'jest/globals': true,
    commonjs: true,
    es2017: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  plugins: [
    'jest',
  ],
  ignorePatterns: [
    'node_modules/*',
  ],
  rules: {
    // allow if/else on separate lines
    'brace-style': ['error', 'stroustrup'],

    // allow comma dangle
    'comma-dangle': ['error', 'only-multiline'],
  },
}
