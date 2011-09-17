var template = require('./template');
var http = require('http');

console.log("creating instance");
var t = new template.Template('tmpl/tmpl.txt', false);
console.log("calling render");

//setTimeout(function() {console.log("helloworld");}, 1000);
//setTimeout(function() {console.log(t.tmpl.replace(/</g,"&lt;").replace(/>/,"&gt;"));}, 2000);

var server = http.createServer(function(req, res) {
    res.writeHead(200);
    t.render({titolo: 'titolone', corpo: 'corpone'}, function(buffer) {
        res.end(buffer);
    });
    
});
server.listen(process.env.C9_PORT,'0.0.0.0');

