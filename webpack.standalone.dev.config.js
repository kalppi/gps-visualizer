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
	mode: 'development',
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
			},
			{
				test: /.html$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					}
				},
				{
					loader: 'string-replace-loader',
					options: {
						multiple: [{
							search: '%apiKey%',
							replace: JSON.stringify(process.env.GOOGLE_API_KEY)
						}, {
							search: '%data%',
							replace: fs.readFileSync('./test-data/WENNO-2017-07.json').toString()
						}]
					}
				}]
			}
		],
	},
	target: 'web',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		}),
	]
};
