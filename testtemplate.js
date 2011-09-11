var template = require('./template');
var http = require('http');

var server = http.createServer(function(req, res) {
    template.Template('tmpl/tmpl.txt', function(tmpl) {
        res.writeHead(200);
        titolo = "TITOLO";
        corpo = "CORPO";
        eval(tmpl);
        res.end("");
    });
});
server.listen(process.env.C9_PORT,'0.0.0.0');