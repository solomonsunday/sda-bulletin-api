//@ts-check
const path = require('path');
const slsw = require('serverless-webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const base = require('./webpack.base.js');

console.log({ entries: slsw.lib.entries, stage: slsw.lib.options.stage });

const config = merge(base, {
  mode:
    slsw.lib.options.stage === 'production' ? slsw.lib.options.stage : 'none',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  stats: 'minimal',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          // extractComments: "all",
          compress: {
            drop_console: false,
            drop_debugger: true,
          },
        },
      }),
    ],
  },
});
module.exports = config;
