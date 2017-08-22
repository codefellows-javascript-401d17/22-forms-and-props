'use strict';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: `${__dirname}/src/main.js`,
  output: {
    publicPath: '/',
    path: `${__dirname}/build`,
    filename: 'build-[hash].js'
  },
  module: {
    rules: [
      { test:/\.js$/, exclude:/\node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html'}),
    new ExtractTextPlugin('bundle-[hash].css')
  ],
  devtool: 'cheap-eval-source-map'
}