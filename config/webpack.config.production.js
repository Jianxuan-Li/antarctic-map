// https://www.maizhiying.me/posts/2017/03/01/webpack-babel-ie8-support.html
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const webpack = require('webpack')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rules = require('./webpack.rules')
const BundleTracker = require('webpack-bundle-tracker');
const alias = require("./alias")

module.exports = {
  mode: 'production',
  entry: {
    index:       ["./frontend/index/index"],
    antarctic:   ["./frontend/antarctic/index"],
  },
  output: {
    path: path.join(__dirname, '../static/dist/'),
    filename: '[name].[hash].js',
    publicPath: "/static/dist/",
    chunkFilename: '[name].[hash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 将第三方模块提取出来
          test: /[\\/]node_modules[\\/](react|react-dom|isomorphic-fetch|mobx|mobx-react)[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10, // 优先级
          enforce: true
        }
      }
    },
    minimizer: [
      // 压缩
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
      new webpack.BannerPlugin(`
      Production build ${moment().format('YYYY-MM-DD HH:mm:ss')}
      Copy right by antarctic.freeyeti.net
      FreeYeti <yeti@freeyeti.net>
      `)
    ]
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx'],
    alias: { ...alias.alias }
  },
  amd: {
    toUrlUndefined: true
  },
  node: {
    fs: 'empty'
  },
  module: {
    unknownContextRegExp: /^.\/.*$/,
    unknownContextCritical: false,
    rules: rules.concat([{
      test: /\.jsx?$/,
      loader: ['babel-loader'],
      exclude: /node_modules/
    },
    { // 第三方库 css 文件单独打包，不能模块化处理
      test: /braft-editor\/dist\/index\.css$/,
      loader: [
        'style-loader',
        'css-loader'
      ]
    },
    {
      test: /\.css$/,
      exclude: /(braft-editor)/, // 排除第三方库 css 文件
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[hash:base64]'
          }
        },
        // {
        //   loader: 'postcss-loader',
        //   options: {
        //     config: {
        //       path: 'config/postcss.config.js'
        //     }
        //   }
        // }
      ]
    },
    {
      test: /\.less$/,
      exclude: /(node_modules|antd)/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[hash:base64]'
            }
          }
        },
        // {
        //   loader: 'postcss-loader',
        //   options: {
        //     config: {
        //       path: 'config/postcss.config.js'
        //     }
        //   }
        // },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              relativeUrls: false
            }
          }
        }
      ]
    },
    {
        test: /\.(scss)$/,
        use: [
            MiniCssExtractPlugin.loader,
             {
              loader: 'css-loader', // translates CSS into CommonJS modules
              options: {
                // minimize: true,
                sourceMap: true
              }
            },
            // {
            //   loader: 'postcss-loader', // Run post css actions
            //   options: {
            //     plugins: function () { // post css plugins, can be exported to postcss.config.js
            //       return [
            //         require('precss'),
            //         require('autoprefixer')
            //       ];
            //     }
            //   }
            // }, 
            {
              loader: 'sass-loader' // compiles Sass to CSS
            }, 
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
        ] //use
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          'url-loader?limit=8192&name=image/[hash].[ext]'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ])
  },
  plugins: [
    new WebpackCleanupPlugin({ // 清除上次 build 残留文件
      exclude: []
    }),
    // new webpack.DllReferencePlugin({ // 指定打包时遇到 manifest json中的库时，使用 vendor 文件，而不加载库文件
    //   manifest: require('../tmp/manifest.json')
    // }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      API_SERVER_PLACEHOLDER: JSON.stringify(''),
      "GEOSERVER_URL": JSON.stringify(process.env.GEOSERVER_URL)
    }),
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[name].[hash].css',
      filename: '[name].css'
    }),
    // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.BannerPlugin(`
    // Production build ${moment().format('YYYY-MM-DD HH:mm:ss')}
    // Copy right by www.freeyeti.net
    // FreeYeti <yeti@freeyeti.net>
    // `),
    new BundleTracker({ filename: './webpack-stats-production.json' })
  ],
  stats: { children: false },
  performance: {
    hints: false
  }
}