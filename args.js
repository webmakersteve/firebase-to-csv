var util = require('util');
// In the spirit of scala options

function Arguments() {

	var r = process.argv;
	var numArgs = r.length;
	var args = {};

	r.forEach(function (val, index, array) {
		if (index < 2) return;

		var key;
		key = index;

	 	args[index] = val;
	});

	this.args = args;
	this.fn = {};

}

Arguments.prototype.throwMeMaybe = function(obj) {
	if (util.isError(obj)) {
		obj.type = 'ArgumentsError';
		throw obj;
	}
	return obj;
}

Arguments.prototype.getArgument = function(key, fallback) {
	if (this.fn.hasOwnProperty(key)) {
		var value = this.fn[key](key, fallback);
		if (value === undefined) {
			return this.throwMeMaybe(fallback);
		}
		return value;
	}
	else if (this.args.hasOwnProperty(key)) {
		return this.args[key];
	} else {
		// Check if fallback is an error. If so, throw it.
		return this.throwMeMaybe(fallback);
	}
};

Arguments.prototype.last = function() {
	var keys = Object.keys(this.args); 
	var lastKey = keys.reverse()[0];

	var last = this.args[lastKey];
	return last;
}

Arguments.prototype.penultimate = function() {
	var keys = Object.keys(this.args); 
	var key = keys.reverse()[1];

	if (key == undefined) return undefined;

	var arg = this.args[key];
	return arg;
}

Arguments.prototype.extend = function(key, cb) {
	this.fn[key] = cb.bind(this);
}

Arguments.prototype.isSet = function(key) {
	return this.args.hasOwnProperty(key);
};

module.exports = new Arguments;