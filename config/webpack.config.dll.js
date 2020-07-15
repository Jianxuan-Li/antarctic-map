const fs = require('fs')
const path = require('path')
const moment = require('moment')
const webpack = require('webpack')
const dependencies = require('../package.json').dependencies
const BundleTracker = require('webpack-bundle-tracker');

/**
 * https://webpack.docschina.org/plugins/dll-plugin/
 * 将 dependencies 中第三方库打包成独立的 dll 文件， manifest.json 作为索引
 */
module.exports = {
  mode: 'production',
  entry: {
    vendor: Object.keys(dependencies).filter(name => name !== 'bundle-loader')
  },
  output: {
    path: path.join(__dirname, '../static/dist'),
    publicPath: "/static/dist/",
    filename: '[name].js',
    library: '[name]'
  },
  amd: {
    toUrlUndefined: true
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../tmp', 'manifest.json'),
      name: '[name]'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // new webpack.optimize.UglifyJsPlugin(), // 代码压缩
    new webpack.BannerPlugin(`
    FreeYeti <yeti@freeyeti.net>
    ${moment().format('YYYY-MM-DD HH:mm:ss')}
    `), // 头部注释
    // new BundleTracker({ filename: './webpack-stats-vendor.json' }),
  ],
  performance: {
    hints: false
  }
}
