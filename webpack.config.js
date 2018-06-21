const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

module.exports = {
	entry: './app.js',
	output: {
		path: path.resolve(__dirname, 'builds'),
		filename: 'bundle.js'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test:   /\.(js|jsx)/,
				exclude: /node_modules/,
				include: [
					__dirname,
					path.resolve(__dirname, 'src')
				],
				use: [{
					loader: 'babel-loader',
				}, {
					loader: 'string-replace-loader',
					options: {
						search: '%embed%',
						replace: JSON.stringify(null)
					}
				}]
			},
			{
				test: /\.(html|css)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					}
				}
			}
		],
	},
	target: 'web',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development'),
				'GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
				'DATA': fs.readFileSync('./test-data/WENNO-2017-07.json').toString()
			}
		})
	]
};