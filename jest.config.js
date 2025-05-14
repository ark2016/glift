/**
 * Конфигурация Jest для тестирования Glift.
 */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/deps/glift-core/$1'
  },
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/test/**/*.test.js'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'deps/glift-core/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true
}; 