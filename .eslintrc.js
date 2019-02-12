module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  plugins: [
    'react',
    'flowtype'
  ],
  rules: {},
  globals: {
    test: false,
    expect: false,
    jest: false,
    describe: false,
    it: false,
    __COUNTRY__ :  false,
    __IS_CONTACT_CENTER__: false

  }
}
