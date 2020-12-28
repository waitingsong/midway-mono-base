const path = require('path');
const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.{ts,tsx}',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  projects: ['<rootDir>/packages/*/jest.config.js'],
}

