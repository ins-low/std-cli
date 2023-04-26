const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('@vue/compiler-sfc');
console.log(VueLoaderPlugin)
const path = require("path");
module.exports = {
  entry: {
    main: ["./src/docs/src/main.js"],
  },
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "./js/[name]" + ".js",
    // publicPath: ''
  },
  devServer: {
    port: '10086',
    hot: true,
    // open:true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),

    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'index page',
      template: './src/docs/public/index.html',
      // publicPath: '../',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          //不需要打包的静态资源
          from: './src/docs/public',
          to: './src/docs/dist',
          // toType: 'dir',
          // ignore: publicCopyIgnore
        },
      ],
    }),
  ]
}