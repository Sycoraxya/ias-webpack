/**
 * Created by Stefan on 30/09/2016.
 */
const webpack = require('webpack'),
      path    = require('path');

exports.whitelabel = function (common, PATHS) {
	common.entry = {whitelabel: PATHS.entry.whitelabel};
	PATHS.build  = path.join(PATHS.build, 'whitelabel');

	return common, PATHS;
};

exports.crossblocks = function (common, PATHS) {
	common.entry = {crossblocks: PATHS.entry.crossblocks};
	PATHS.build  = path.join(PATHS.build, 'crossblocks');

	return common, PATHS;
};

exports.admin = function (common, PATHS) {
	common.entry = {admin: PATHS.entry.admin};
	//PATHS.build  = path.join(PATHS.build, 'admin');
	PATHS.build = path.join('./', 'clients', 'default', 'admin', 'view', 'javascript', 'test');

	return common, PATHS;
};