const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    publicPath: '/',
    hot: true,
    overlay: true,
    port: 3000,
    stats: 'errors-only',
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[hash].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './client/index.html'
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
