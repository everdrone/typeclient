const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'postcss-loader' },
    // { loader: 'sass-loader' },
  ],
})

rules.push({
  test: /\.scss$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader' },
    { loader: 'sass-loader' },
  ],
})

module.exports = {
  target: 'electron-renderer',
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new MonacoWebpackPlugin({
      languages: ['json'],
      // filename: '[name].worker.[contenthash].js',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
    plugins: [new TsconfigPathsPlugin()],
  },
}
