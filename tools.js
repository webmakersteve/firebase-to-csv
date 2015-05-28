var _ = require('lodash');
var path = require('path');

module.exports.$toArray = function(obj) {
	var records = [];
	_.forEach(obj, function(v, k) {
		var record = {
			id: k
		};

		if (typeof v == 'object') {
			_.forEach(v, function(v, k) {
				record[k] = v;
			});
		}
		records.push(record);
	});

	return records;
};

module.exports.prepareCSV = function(obj) {

	var first = true;
	var headers = [];
	var data = [];

	_.forEach(obj, function(value, key) {
		if (typeof value !== 'object') return;
		var me = [];
		_.forEach(value, function(data, header) {
			if (first === true) {
				headers.push(header);
			}
			me.push(data);
		});


		data.push(me);
		first = false;
	})

	data.unshift(headers);

	return data;

};

module.exports.resolvePath = function(string) {
	if (string.substr(0,1) === '~')
	string = process.env.HOME + string.substr(1)
	return path.resolve(string)
}