/**
 * Created by Stefan on 26/09/2016.
 */
const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      merge = require('webpack-merge'),
      validate = require('webpack-validator');

const parts = require('./libs/parts');

const pkg = require('./package.json');

const PATHS = {
	app: path.join(__dirname, 'app'),
	style: [
		path.join(__dirname, 'node_modules', 'purecss'),
		path.join(__dirname, 'app', 'main.css')
	],
	build: path.join(__dirname, 'build')
};

const common = {
	// Entry accepts a path or an object of entries.
	// We'll be using the latter form given it's
	// convenient with more complex configurations.
	entry: {
		style: PATHS.style,
		app: PATHS.app,
		vendor: Object.keys(pkg.dependencies)
	},
	output: {
		path: PATHS.build,
		filename: '[name].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Webpack demo'
		})
	]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
	case 'build':
	case 'stats':
		config = merge(
			common,
			{
				devtool: 'source-map',
				output: {
					path: PATHS.build,
					filename: '[name].[chunkhash].js',
					// This is used for require.ensure. The setup
					// will work without but this is useful to set.
					chunkFilename: '[chunkhash].js'

				}
			},
			parts.clean(PATHS.build),
			parts.setFreeVariable(
				'process.env.NODE_ENV',
				'production'
			),
			parts.extractBundle({
				name: 'vendor',
				entries: ['react']
			}),
			parts.minify(),
			parts.extractCSS(PATHS.style),
			parts.purifyCSS([PATHS.app])
		);
		break;
	default:
		config = merge(common,
			parts.setupCSS(PATHS.style),
			{
				devtool: 'eval-source-map'
			},
			parts.devServer({
				host: process.env.HOST,
				port: process.env.PORT
			})
		);
}

module.exports = validate(config, {
	quiet: true
});