// const path = require('path');

module.exports = {
  entry: {
    main: './src/main.js',
    admin: './src/admin.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // include: [path.resolve(__dirname, './src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '../images',
            outputPath: 'images',
            name: '[name].[hash].[ext]'
          }
        }
      }
    ]
  }
};
