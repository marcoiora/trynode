var template = require('./template');
var http = require('http');

t = new template.Template('tmpl/tmpl.txt');

var server = http.createServer(function(req, res) {
    res.writeHead(200);
    t = new template.Template('tmpl/tmpl.txt');
    /*template.Template('tmpl/tmpl.txt', function(tmpl) {
        res.writeHead(200);
        titolo = "TITOLO";
        corpo = "CORPO";
        eval(tmpl);
        res.end("");
    });*/
});
server.listen(process.env.C9_PORT,'0.0.0.0');