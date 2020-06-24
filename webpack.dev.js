const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '/dist'),
    publicPath: '',
    filename: 'js/[name].[contentHash].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      excludeChunks: ['admin']
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: './public/admin.html',
      excludeChunks: ['app']
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // 3. inject styles into DOM
          'css-loader', // 2. Turns css into commonjs
          'sass-loader' // 1. Turns sass into css
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // 2. inject styles into DOM
          'css-loader', // 1. Turns css into commonjs
        ]
      }
    ]
  }
});
