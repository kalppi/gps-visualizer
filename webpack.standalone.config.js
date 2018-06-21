const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

module.exports = {
	entry:  './wrapper.js',
	output: {
		libraryTarget: 'var',
		library: 'gpsVisualizer',
		path: path.resolve(__dirname, 'builds'),
		filename: 'gps-visualizer.js',
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.js$/,
				include: __dirname,
				use: [{
					loader: 'babel-loader'
				}, {
					loader: 'string-replace-loader',
					options: {
						search: '%embed%',
						replace: process.env.GPS_DATA ?
							fs.readFileSync(process.env.GPS_DATA).toString() : JSON.stringify(null)
					}
				}]
			}
		],
	},
	target: 'web',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compressor: {
						warnings: false
					},
					mangle: true,
					unused: true,
					dead_code: true,
					warnings: false,
					drop_debugger: true,
					conditionals: true,
					evaluate: true,
					drop_console: true,
					sequences: true,
					booleans: true,
					compress: {
						warnings: false,
						pure_getters: true,
						unsafe: true,
						unsafe_comps: true
					},
					output: {
						comments: false,
					}
				}
			})
		]
	}
};
