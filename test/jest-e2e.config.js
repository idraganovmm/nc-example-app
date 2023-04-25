/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  // run test via Nodejs
  testEnvironment: 'node',
  // needed for TypeScript
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // root dir is the app root
  rootDir: '..',
  // match anything that is spec-e2e or test-e2e with a js, jsx, ts and tsx extension
  testMatch: [
    "**/?(*.)+(spec|test)-e2e.[tj]s?(x)"
  ],
  // does some setup before each test file
  setupFiles: [
    '<rootDir>/test/jest.setup.ts'
  ],
  // path aliases from tsconfig.json
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/api',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@modules$': '<rootDir>/src/modules',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@common$': '<rootDir>/src/common',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@database$': '<rootDir>/src/database',
    '^@extensions/(.*)$': '<rootDir>/src/extensions/$1'
  },
  // disable unit test manual mocks
  modulePathIgnorePatterns: [
    '<rootDir>/__mocks__',
    '<rootDir>/src/.*/__mocks__'
  ],
  // change coverage directory name so that it doesn't overlap with unit test coverage
  coverageDirectory: '<rootDir>/coverage-e2e',
  // coverage is collected from files under src/
  collectCoverageFrom: [
    '<rootDir>/src/**/*.[tj]s?(x)',
  ],
  // and from those files ignore
  coveragePathIgnorePatterns: [
    // entry points
    '<rootDir>/src/index.[tj]sx?$',
    '<rootDir>/src/app.[tj]sx?$',
    // extensions
    '<rootDir>/src/extensions',
    // module indexes
    '<rootDir>/.*/index.[tj]sx?$',
    // unit tests
    '(spec|test).[tj]sx?$',
    // type definitions
    '<rootDir>/src/@types/',
    // database migrations
    '<rootDir>/src/modules/database/migrations',
    // utility code
    '<rootDir>/src/common',
    '<rootDir>/src/modules/database/utils',
    // middleware
    '<rootDir>/src/api/middleware'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
