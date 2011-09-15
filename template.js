var fs = require('fs');

function Template(path) {
    this.path = path;
    this.tmpl = "";
    this.loaded = false;
    this.error;
    this.step = 0;
}

Template.prototype = {
    render : function() {
        var self = this;
        this.step = 1;
        if (!this.loaded) {
            fs.readFile(this.path, this.load(this));
        }
    },
    toString : function() {
        return this.constructor.name + " loaded=" + this.loaded + " tmpl=" + this.tmpl+ " step="+this.step;
    },
    load : function(context) {
        var self = context;
        return function(err, data) {
        
        if (!err) {
            data = data.toString();
            var prev = 0;
            var cur = 0;
            self.tmpl = "";
            while ((cur = data.indexOf("<%",prev)) > -1) {
                if (cur > prev) {
                    var plain = data.substring(prev,cur);
                    self.tmpl = self.tmpl + "buffer += \""+plain.replace(/"/g,"\\\"").replace(/\n/,"\\n")+"\";";
                }
                prev = data.indexOf("%>",cur);
                var code = data.substring(cur+3,prev);
                if (data[cur+2] == "=") {
                    self.tmpl = self.tmpl + "buffer += " + code.trim() + ";";
                } else {
                    self.tmpl = self.tmpl + code.trim();
                }
                prev = prev+2;
            }
            if (prev >= 0) {
                var plain = data.substring(prev);
                self.tmpl = self.tmpl + "buffer += \""+plain.replace(/"/g,"\\\"").replace(/\n/,"\\n")+"\";";
            }
            self.loaded = true;
    	} else {
            self.loaded = false;
            self.error = err;
		}
    }}
}

exports.Template = Template;

