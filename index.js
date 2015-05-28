var Firebase = require('firebase');
var args = require('./args');
var colors = require('colors');
var _ = require('./tools');
var Exporter = require('./exporter');

function fetch(url, cb, path) {
	if (!cb) cb = function() {};
	path = path || false;

	var firebase = new Firebase(url);

	firebase.on('value', function(snap) {
		var value = snap.val();
		var array = _.$toArray(value);
		var data = _.prepareCSV(array);

		var e = new Exporter(path);
		if (path === false) {
			return cb(e.toStream(data));
		}

		e.writeToFile(data);

		e.on('finished', cb);
		e.on('error', function(err) {
			throw err;
		});

	});
}

if (require.main === module) {

	args.extend('filepath', function() {
		var path = this.penultimate();
		if (!path) return false;
		path = this.last();

		return _.resolvePath(path);

	});

	args.extend('firebaseUrl', function() {
		var arg = this.penultimate();
		if (!arg) arg = this.last();
		return arg;
	});

	var path = args.getArgument('filepath', './export.csv');
	var firebaseUrl = args.getArgument('firebaseUrl', new Error('Must specify a firebase URL'));

	colors.setTheme({
	  input: 'grey',
	  verbose: 'grey',
	  error: 'blue',
	  trace: 'red'
	});

	process.on('uncaughtException', function(error) {
		console.log('Please correct the following error(s)'.underline)
		if (!error.hasOwnProperty('type')) {
			console.log( error.stack );
		} else {
			console.log( error.message.error.bold);
		}
	});

	/*
	fetch(firebaseUrl, function(stream) {
		stream
			.pipe(process.stdout);

		stream.on('end', process.exit);
	});*/

	fetch(firebaseUrl, function() {
		process.exit();
	}, path);

}

module.exports = fetch;