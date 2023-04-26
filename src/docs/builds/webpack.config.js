const webpack = require('webpack');
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
    open:true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
}