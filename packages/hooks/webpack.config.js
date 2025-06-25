const merge = require('webpack-merge')
const commonConfig = require('../../webpack.common.js')
const path = require('path')

module.exports = merge(commonConfig, {
  entry: './es/index.js',
  output: {
    filename: 'myHooks.js',
    library: 'myHooks',
    path: path.resolve(__dirname, './dist')
  }
})