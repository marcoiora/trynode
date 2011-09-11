var fs = require('fs');

function Template(path, callback) {
	fs.readFile(path, function(err, data) {
		if (!err) {
            lines = data.utf8Slice().split("\n");
            var output = "";
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.match(/^- .+/)) {
                    output += line.replace(/^- /,"");
                } else {
                    output += "res.write(\""+line.replace(/"/g,"\\\"")+"\");";
                }
            }
            callback.apply(this,[output]);
		} else {
			callback.apply(this,["Error, template "+path+" not found"]);
		}
	});
}

exports.Template = Template;

