/**
 * Created by Stefan on 28/09/2016.
 */
const webpack            = require('webpack'),
      CleanWebpackPlugin = require('clean-webpack-plugin'),
      ExtractTextPlugin  = require('extract-text-webpack-plugin'),
      AssetsPlugin       = require('assets-webpack-plugin');

// https://github.com/kossnocorp/assets-webpack-plugin
const assetsPluginInstance = new AssetsPlugin({
	fullPath   : false,
	prettyPrint: true,
	update     : true
});

exports.minify = function () {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				beautify: false,
				comments: false,
				compress: {
					warnings    : false,
					// Drop `console` statements
					drop_console: false
				},
				mangle  : {
					except     : ['webpackJsonp', '$'],
					screw_ie8  : true,
					keep_fnames: true
				}
			})
		]
	}
};

exports.clean = function (path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				// Without `root` CleanWebpackPlugin won't point to our
				// project and will fail to work.
				root: process.cwd(),
			})
		]
	}
};

exports.extractCSSProd = function (paths) {
	return {
		module : {
			loaders: [
				//extract CSS during build
				{
					test   : /\.css$/,
					loader : ExtractTextPlugin.extract('style', 'css'),
					exclude: /node_modules/,
					include: paths
				},
				{
					test   : /\.scss$/,
					loader : ExtractTextPlugin.extract('style', 'raw!sass'),
					exclude: /node_modules/,
					include: paths
				},
				{
					test   : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader : "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]",
					exclude: /node_modules/,
					include: paths
				},
				{
					test   : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader : "file-loader?name=fonts/[name].[ext]",
					exclude: /node_modules/,
					include: paths
				}
			]
		},
		plugins: [
			// Output extracted CSS to a file
			new ExtractTextPlugin('[name]/styles/[chunkhash].css', {allChunks: true})
		]
	}
};

exports.extractCSSDev = function (paths) {
	return {
		module : {
			loaders: [
				//extract CSS during build
				{
					test   : /\.css$/,
					loader : ExtractTextPlugin.extract('style', 'css'),
					exclude: /node_modules/,
				},
				{
					test   : /\.scss$/,
					loader : ExtractTextPlugin.extract('style', 'raw!sass'),
					exclude: /node_modules/,
				},
				{
					test   : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader : "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]",
					exclude: /node_modules/,
				},
				{
					test   : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader : "file-loader?name=fonts/[name].[ext]",
					exclude: /node_modules/,
				}
			]
		},
		plugins: [
			// Output extracted CSS to a file
			new ExtractTextPlugin('[name]/styles/style.css', {allChunks: true})
		]
	}
};

exports.exportsAssetsJSON = function () {
	return {
		plugins: [
			assetsPluginInstance
		]
	}
};

exports.compileJS = function () {
	return {
		module : {
			loaders: [
				{
					test   : /\.js$/,
					loaders : ['babel'],
					exclude: /node_modules/,
				},
				{
					test   : /\.json$/,
					loader : 'json',
					exclude: /node_modules/,
				},
				/*{   // To expose it to the global object, can be replaced with
				 // ProvidePlugin when everything is modulated
				 // https://github.com/webpack/docs/wiki/shimming-modules#exposing
				 test: require.resolve("jquery"),
				 loader: "expose?$!expose?jQuery"
				 }*/
			]
		},
		plugins: [
			// Ignoe all locale folders in moment, resulting in a much smaller file size ~150kb
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		]
	}
};

exports.dedupe = function () {
	return {
		plugins: [
			new webpack.optimize.DedupePlugin()
		]
	}
};

exports.commonChunk = function () { //https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
	return {
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: "commons",
				// (the commons chunk name)

				filename: "commons.js",
				// (the filename of the commons chunk)

				// minChunks: 3,
				// (Modules must be shared between 3 entries)

				// chunks: ["pageA", "pageB"],
				// (Only use these entries)
			})
		]
	}
};