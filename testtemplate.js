var template = require('./template');

var s = function() {};
s.titolo = "TITOLO";
s.corpo = "CORPO";

template.Template('tmpl/tmpl.txt',s, console.log);