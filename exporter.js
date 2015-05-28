var util = require('util');
var events = require('events');
var csv = require('csv');
var fs = require('fs');
var stream = require('stream');

function Exporter(path) {
	this.path = path;
	this.emit('finished', false);
}

util.inherits(Exporter, events.EventEmitter);

Exporter.prototype.toStream = function(data) {
	var s = new stream.Readable();

	s._data = data.toString();

	s._read = function(n) {
		var chunk;
		n = (n == null || n === -1) ? undefined : n;
		chunk = this._data.slice(0, n);

		this._data = this._data.slice(n);
		if (chunk == "") {
			return this.emit('end');
		} else {
			this.push(chunk);
			this.emit('data', chunk);
			return chunk;
		}
	};

	return s;
}

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