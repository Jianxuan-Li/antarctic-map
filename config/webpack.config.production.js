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
          test: /[\\/]node_modules[\\/](react|react-dom|isomorphic-fetch|mobx|mobx-react)[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    minimizer: [
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
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.less$/,
      exclude: /(node_modules)/,
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
    new WebpackCleanupPlugin({
      exclude: []
    }),
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
    new BundleTracker({ filename: './webpack-stats-production.json' })
  ],
  stats: { children: false },
  performance: {
    hints: false
  }
}