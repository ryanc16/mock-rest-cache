const path = require('path');

module.exports = {
  entry: {
    background: './src/extension/background.ts',
    content: './src/extension/content.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist/extension/'),
    filename: '[name].bundle.js'
  },
  devtool: 'inline-source-map',
  optimization: {
    minimize: false
  }
};