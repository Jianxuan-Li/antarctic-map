require('dotenv').config()
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const rules = require("./webpack.rules");
const BundleTracker = require("webpack-bundle-tracker");
const alias = require("./alias")

const devProtocol = 'http'                  //开发环境启动协议，http 或 https
const devHost = 'antarctic-map-statics'     //开发环境所在主机名，一般是localhost，如果连接远程的环境则写0.0.0.0
const devPort = 9000;                       //启动端口，同时启动多个APP的时候需要启动在不同端口
const staticPath = '/static/dist/';         //和settings.py里的WEBPACK_LOADER的设置对应

const publicPath = (protocol, host, port, path) => protocol + "://" + host + ":" + port + path

module.exports = {
  // In development envrionment, we default add the react-hot-reload plugin here.
  // If need polyfill, add `import "@babel/polyfill"` to entry file
  mode: 'development',
  entry: {
    index:       ["./frontend/index/index"],
    antarctic:       ["./frontend/antarctic/index"],
  },
  output: {
    path: path.join(__dirname, ".." + staticPath),
    filename: "[name].dev.js",

    //For webpack bundle tracker: Let Django knows where are the bundled statics
    publicPath: publicPath(devProtocol, devHost, devPort, staticPath)
  },
  devtool: "cheap-module-eval-source-map",
  resolve: {
    modules: ["node_modules", "fontend"],
    extensions: [".js", ".jsx"],

    // Alias for your Apps, better to set it up.
    // These configure could helps you avoid import module like '../../../../constant'
    alias: { ...alias.alias }
  },
  module: {
    rules: rules.concat([
      {
        test: /\.jsx?$/,
        loader: ["babel-loader", "eslint-loader"],
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
          { loader: 'style-loader', },
          { loader: 'css-loader', },
          { loader: 'less-loader',
            options: {
              lessOptions: {
                relativeUrls: false,
                javascriptEnabled: true,
              },
            }, 
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader', // inject CSS to page
          }, {
            loader: 'css-loader', // translates CSS into CommonJS modules
            options: {
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
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: "url-loader?limit=8192&name=image/[hash].[ext]"
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
    new webpack.NoEmitOnErrorsPlugin(), // webpack 进程遇到错误代码将不会退出
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.DefinePlugin({
      // 编译时可以配置的全局常量 如 api host
      "PRODUCTION": JSON.stringify(false),
      "API_SERVER_PLACEHOLDER": JSON.stringify(""),
      "GEOSERVER_URL": JSON.stringify(process.env.GEOSERVER_URL)
    }),
    new webpack.ProvidePlugin({
      // 自动加载模块, 如 jquery
      React: "react"
    }),
    new BundleTracker({ filename: "./webpack-stats-development.json" })
  ],
  devServer: {
    // 本地服务
    contentBase: path.join(__dirname, ".." + staticPath),
    compress: true,
    hot: true, // 热更新
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: true, // 404 页面替换
    host: '0.0.0.0', // 配置 host, 服务器外部可访问
    port: devPort,
    disableHostCheck: true,
    public: devHost + ":" + devPort,
    publicPath: staticPath,
  },
  performance: {
    hints: false
  }
};
