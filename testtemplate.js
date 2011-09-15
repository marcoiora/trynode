var template = require('./template');
var http = require('http');

var t = new template.Template('tmpl/tmpl.txt');
t.render();
setTimeout(function() {console.log("helloworld");}, 1000);
setTimeout(function() {console.log(t.tmpl.replace(/</g,"&lt;").replace(/>/,"&gt;"));}, 2000);
/*
var server = http.createServer(function(req, res) {
    res.writeHead(200);
    t = new template.Template('tmpl/tmpl.txt');
    t.render();
    ;
    res.end(t.tmpl);
});
server.listen(process.env.C9_PORT,'0.0.0.0');
*/
