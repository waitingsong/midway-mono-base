const path = require('path');

module.exports = {
  cacheDirectory: "<rootDir>/.vscode/.jest-cache/",
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/test/',
    '<rootDir>/src/config/',
    '<rootDir>/src/database/',
  ],
  coverageReporters: [
    "html",
    "json", 
    "text", 
    "text-summary",
  ],
  forceExit: true,
  globals: {
    "ts-jest": {
      "tsconfig": "test/tsconfig.json"
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/test/fixtures',
    '<rootDir>/src/config/',
    '<rootDir>/src/database/',
  ],
  testTimeout: 30000,
}

