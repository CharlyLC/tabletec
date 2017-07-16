
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var serverConfig = {
	node: {
		__filename: true,
		__dirname: false
	},
	target: 'node',
	externals: [nodeExternals()],

	entry: {
		"index": "./src/server/index.js",
	},

	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js"
	},
	
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	}
};

var clientConfig = {
	target: 'web',

	/*resolve: {
		alias: {
			'react': 'react-lite',
			'react-dom': 'react-lite'
		}
	},*/

	entry: {
		"tabletec": "./src/client/main-app.jsx",
	},

	output: {
		path: path.join(__dirname, "dist", "assets"),
		filename: "js/[name].min.js"
	},

	module: {
		rules: [
			{
				test: /\.jsx?/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/tabletec.min.css')
	]
};

module.exports = [ serverConfig, clientConfig ];
