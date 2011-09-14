var fs = require('fs');

function Template(path) {
    var self = this,
        output, buffer;
        
    var loaded = false;
    var error;
    
	fs.readFile(path, function(err, data) {
		if (!err) {
            data = data.utf8Slice().replace(/(.*)(?!<%.*%>)/g, function(matched, p, index) {
				console.log(matched);
				
                lines = p.split("\n");
                outtext = "";
                for (i = 0; i < lines.length; i++) {
                    outtext += "buffer += \""+lines[i].replace(/"/g,"\\\"")+"\\n\";\n";
                }
                return outtext;
            });
			
            data = data.replace(/<% (.*) %>/g, function(matched,p,index) {
                return p;
            });
            data = data.replace(/<%= (.*) %>/g, function(matched,p,index) {
                return "buffer += ("+p+");";
            });
            
            
            /*
            lines = data.utf8Slice().split("\n");
            var output = "";
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.match(/^- .+/)) {
                    output += line.replace(/^- /,"");
                } else {
                    output += "buffer += \""+line.replace(/"/g,"\\\"")+"\";";
                }
            }*/
		} else {
            loaded = false;
            error = err;
            console.log('err');
		}
	});
}

Template.prototype = {
    render : function(context) {
        eval.apply(context,output);
    }
}

exports.Template = Template;

