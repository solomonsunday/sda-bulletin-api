//@ts-check
'use strict';
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const base = {};
const config = merge(base, {
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		// @ts-ignore
		plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
	},
	performance: {
		hints: 'warning',
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			}
		],
	},
	target: 'node',
	node: {
		__dirname: true,
		__filename: true,
	},
	externals: [nodeExternals()],
});
module.exports = config;