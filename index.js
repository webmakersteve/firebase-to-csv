var Firebase = require('firebase');
var args = require('./args');
var colors = require('colors');
var _ = require('./tools');
var Exporter = require('./exporter');

args.extend('firebaseUrl', function() {
	return this.last();
});

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

var firebaseUrl = args.getArgument('firebaseUrl', new Error('Must specify a firebase URL'));

var firebase = new Firebase(firebaseUrl);

firebase.on('value', function(snap) {
	var value = snap.val();
	var array = _.$toArray(value);
	var data = _.prepareCSV(array);

	var e = new Exporter('./export.csv');
	e.writeToFile(data);

	e.on('finished', process.exit);
	e.on('error', function(err) {
		throw err;
	});

});