var fs = require('fs');
var util = require('util');

function Template(path, data, callback) {
	fs.readFile(path, function(err, data) {
		if (!err) {
			callback.apply(this,["Read"]);
		} else {
			callback.apply(this,["Error, template "+path+" not found"]);
		}
	});
}

exports.Template = Template;

