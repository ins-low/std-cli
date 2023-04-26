const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config");
const server = new webpackDevServer(webpackConfig.devServer, webpack(webpackConfig));

  server.start().then(resolve => {
    console.log(resolve)
  }).catch(err => {
    console.log('err.start:',err);
  });