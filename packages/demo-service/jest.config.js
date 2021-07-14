const path = require('path');
const baseConfig = require('../../jest.config.base')
const packageName = require('./package.json').name.split('/').pop()

module.exports = {
  ...baseConfig,
}

