var fs = require('fs');

function Template(path, preload) {
    this.path = path;
    this.tmpl = "";
    this.loaded = false;
    this.error;
    this.loading = false;
    this.loadingcallbacks = [];
    
    if (preload) {
        this.load(function(){});
    }
}

Template.prototype = {
    load : function(callback) {
        console.log("called load");
        if (this.loading)
            return;
        this.loading = true;
        
        var self = this;
        
        fs.readFile(this.path, function(err, data) {
            if (!err) {
                data = data.toString();
                var prev = 0;
                var cur = 0;
                self.tmpl = "";
                while ((cur = data.indexOf("<%",prev)) > -1) {
                    if (cur > prev) {
                        var plain = data.substring(prev,cur);
                        self.tmpl = self.tmpl + "this.buffer += \""+plain.replace(/"/g,"\\\"").replace(/\n/g," ")+"\";";
                    }
                    prev = data.indexOf("%>",cur);
                    var code = data.substring(cur+3,prev);
                    if (data[cur+2] == "=") {
                        self.tmpl = self.tmpl + "this.buffer += " + code.trim() + ";";
                    } else {
                        self.tmpl = self.tmpl + code.trim();
                    }
                    prev = prev+2;
                }
                if (prev >= 0) {
                    var plain = data.substring(prev);
                    self.tmpl = self.tmpl + "this.buffer += \""+plain.replace(/"/g,"\\\"").replace(/\n/g," ")+"\";";
                }
                self.loaded = true;
                callback.call(self);
            } else {
                self.loaded = false;
                self.error = err;
                callback.call(self);
		    }
        });
    },
    render : function(context, callback) {
        console.log("called render");
        var self = this;
        var context = context;
        var callback = callback;
        // ensure tmpl is loaded
        if (!this.loaded) {
            console.log("calling load from render");
            this.load(function() {
                console.log("finished loadin");
                self.render(context,callback)});
            return;
        } else {
            var container = {};
            container.buffer = "";
            for (var attrname in context) {
                container[attrname] = context[attrname];
            }
            container.dotmpl = function(tmpl) {
                console.log(tmpl);
                eval(tmpl);
            }
            container.dotmpl(this.tmpl);
            //eval.call(container,this.tmpl);
            callback.call(this,container.buffer);
        }
    },
    toString : function() {
        return this.constructor.name + " loaded=" + this.loaded + " tmpl=" + this.tmpl+ " step="+this.step;
    }
}

exports.Template = Template;