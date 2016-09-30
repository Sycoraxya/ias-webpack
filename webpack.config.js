/**
 * Created by Stefan on 26/09/2016.
 */
const path = require('path'),
      merge = require('webpack-merge'),
      validate = require('webpack-validator');

const parts = require('./test/libs/parts'),
      templates = require('./test/libs/templates');

const pkg = require('./package.json');

const argv = JSON.parse(process.env.npm_config_argv).cooked;

const PATHS = {
	entry: {
		crossretail: [
			path.join(__dirname, 'test', 'src', 'crossretail', 'scripts'),
			path.join(__dirname, 'test', 'src', 'crossretail', 'styles', 'global.scss')
		],
		whitelabel : [
			path.join(__dirname, 'test', 'src', 'whitelabel', 'scripts', 'app.js'),
			path.join(__dirname, 'test', 'src', 'whitelabel', 'styles', 'global.scss')
		],
		crossblocks : [
			path.join(__dirname, 'test', 'src', 'crossblocks', 'scripts', 'Setup.js'),
			path.join(__dirname, 'test', 'src', 'crossblocks', 'styles', 'global.scss')
		],
		admin : [
			path.join(__dirname, 'test', 'src', 'admin', 'scripts', 'app.js'),
			path.join(__dirname, 'test', 'src', 'admin', 'styles', 'global.scss')
		],
	},
	build: path.join(__dirname, 'test', 'build')
};

const common = {
	// Entry accepts a path or an object of entries.
	entry: {
		crossretail: PATHS.entry.crossretail,
		whitelabel: PATHS.entry.whitelabel,
		crossblocks: PATHS.entry.crossblocks,
		admin: PATHS.entry.admin,
	},
	output: {
		path: PATHS.build,
		filename: '[name].js'
	},
	cache: true
};

const watch = {
	output: {
		path: PATHS.build,
		publicPath: "../",
		filename: '[name]/scripts/script.js',
		// This is used for require.ensure. The setup
		// will work without but this is useful to set.
		chunkFilename: '[id].chunk.js'
	}
};

const build = {
	output: {
		path: PATHS.build,
		publicPath: "../",
		filename: '[name]/scripts/[chunkhash].js',
		// This is used for require.ensure. The setup
		// will work without but this is useful to set.
		chunkFilename: '[id].chunk.js'
	}
};

var config;

function getCSSPaths (arr) {
	cssPaths = [];
	for (let template of arr) {
		cssPaths.push(PATHS.entry[template][1]);
	}
	return cssPaths;
}

// Detect how npm is run and branch based on that
// Todo: prebuild & prewatch script with query for template name and piping the result or use argv
switch(process.env.npm_lifecycle_event) {
	case 'build':
	case 'stats':
		console.log(process.env);
		config = merge(
			common,
			build,
			parts.clean(PATHS.build),
			parts.compileJS(),
			parts.minify(),
			// Works because it doesn't have any excluded files, can break later, if it stops working use getCSSPaths(Object.keys(PATHS.entry))
			parts.extractCSSProd(),
			parts.dedupe(),
			//parts.commonChunk(),
			parts.exportsAssetsJSON()
		);
		break;
	case 'watch':
		// For using argv
		// console.log(argv[2].substring(2));
		// var template = argv[2].substring(2);
		// templates[template](common, PATHS);
		config = merge(
			common,
			watch,
			parts.clean(PATHS.build),
			parts.compileJS(),
			// Works because it doesn't have any excluded files, can break later, if it stops working use getCSSPaths(Object.keys(PATHS.entry))
			parts.extractCSSDev()
		);
		break;
	case 'watch:whitelabel':
		templates.whitelabel(common, PATHS);
		config = merge(
			common,
			watch,
			parts.clean(PATHS.build),
			parts.compileJS(),
			// Works because it doesn't have any excluded files, can break later, if it stops working use getCSSPaths(Object.keys(PATHS.entry))
			parts.extractCSSDev()
		);
		break;
	case 'watch:crossblocks':
		templates.crossblocks(common, PATHS);
		config = merge(
			common,
			watch,
			parts.clean(PATHS.build),
			parts.compileJS(),
			// Works because it doesn't have any excluded files, can break later, if it stops working use getCSSPaths(Object.keys(PATHS.entry))
			parts.extractCSSDev()
		);
		break;
	case 'watch:admin':
		templates.admin(common, PATHS);
		config = merge(
			common,
			watch,
			{
				output: {
					path: PATHS.build,
				}
			},
			parts.clean(PATHS.build),
			parts.compileJS(),
			// Works because it doesn't have any excluded files, can break later, if it stops working use getCSSPaths(Object.keys(PATHS.entry))
			parts.extractCSSDev()
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