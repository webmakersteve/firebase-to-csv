var _ = require('lodash');

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