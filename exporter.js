var util = require('util');
var events = require('events');
var csv = require('csv');
var fs = require('fs');

function Exporter(path) {
	this.path = path;
	this.emit('finished', false);
}

util.inherits(Exporter, events.EventEmitter);

Exporter.prototype.doWrite = function(data) {
	var $self = this;
	fs.writeFile(this.path, data, function(err) {
		if (err) { return $self.emit('error', err); }

		$self.emit('finished', true);
	})
};

Exporter.prototype.writeToFile = function(data) {
	var $self = this;
	csv.stringify(data, function(err, output) {
		if (err) { return $self.emit('error', err); }

		$self.doWrite(output);

	});
}

module.exports =  Exporter;