const path = require('path');

module.exports = {
  entry: './src/app/popup.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              import: true
            }
          }
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist/app/'),
    filename: 'popup.bundle.js'
  },
  devtool: 'inline-source-map',
  optimization: {
    minimize: false
  }
};