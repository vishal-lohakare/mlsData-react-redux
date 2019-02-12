module.exports = {
  testRegex: '/*.test.js$',
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coverageDirectory: '__reports__/test-coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__test__/__mock__/file.mock.js",
      '^.+\\.s?css$': "<rootDir>/src/__test__/__mock__/style.mock.js"
    },
  setupFiles: ["<rootDir>/test-setup.js", "jest-localstorage-mock"]
}
