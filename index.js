var Firebase = require('firebase');
var args = require('./args');
var colors = require('colors');
var _ = require('./tools');
var Exporter = require('./exporter');

function fetch(url, path, cb) {
	if (!cb) cb = function() {};
	path = path || './export.csv';

	var firebase = new Firebase(firebaseUrl);

	firebase.on('value', function(snap) {
		var value = snap.val();
		var array = _.$toArray(value);
		var data = _.prepareCSV(array);

		var e = new Exporter(path);
		e.writeToFile(data);

		e.on('finished', cb);
		e.on('error', function(err) {
			throw err;
		});

	});
}

if (require.main === module) {

	args.extend('firebaseUrl', function() {
		return this.last();
	});

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

	fetch(firebaseUrl, false, function() {
		process.exit();
	});

}

module.exports = fetch;