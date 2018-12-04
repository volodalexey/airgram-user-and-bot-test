module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest' // https://github.com/facebook/jest/blob/master/examples/typescript/package.json#L25
  },
  testRegex: 'test.ts',
  testPathIgnorePatterns: [
    "/node_modules/", "/dist/"
  ],
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    __TS_CONFIG__: {
      target: 'es6',
      inlineSourceMap: true,
    }
  },
  setupTestFrameworkScriptFile: "./jest.setup.js"
}