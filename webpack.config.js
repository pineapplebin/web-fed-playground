const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const ROOT_PATH = path.resolve(__dirname)
const DIST_PATH = path.resolve(ROOT_PATH, 'dist')
// const APP_PATH = path.resolve(ROOT_PATH, 'src', 'main.tsx')

module.exports = {
  mode: 'development',
  // entry: ['webpack-hot-middleware/client?noInfo=true&reload=true', APP_PATH],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  output: {
    path: DIST_PATH,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  plugins: [
    // new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
