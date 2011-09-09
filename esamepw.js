var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var combo = require('./combo');

var client = mysql.createClient({
  user: 'root',
  password: 'root',
  database: 'esamepw',
  host: '127.0.0.1'
});

function header() {
	var header = "<!DOCTYPE html>\
	<html>\
	<head>\
	<link rel='stylesheet' href='/styles/style.css'>\
	<script src='/js/script.js'></script>\
	<title>MyMovies</title>\
	</head>\
	<body>";
	return header;
}

function footer(res) {
	var footer= "</body>\
	</html>";
	res.end(footer);
}

function get_regista(id_film, callback) {
	client.query("select personale.nome,personale.cognome from personale join regista on personale.id_personale = regista.id_regista where regista.id_film = ?", [id_film], function(err, results, fields) {
		var regista = results[0]['nome']+" "+results[0]['cognome'];
		if (!err) {
			callback.apply(this,[regista]);
		}
	});
}

function get_cast() {
	var onlyvip = true;
	if (arguments.length > 2) {
		var onlyvip = arguments[1];
		var callback = arguments[2];
	} else if (arguments.length > 1) {
		var callback = arguments[1];
	} else {
		throw new Error();
	}
	id_film = arguments[0];
	client.query("select personale.nome, personale.cognome from personale join cast on personale.id_personale = cast.id_attore where cast.id_film = ? and personale.vip = ?", [id_film, onlyvip ? 1 : 0], function(err,results,fields) {
		var result = "";
		for (var i = 0; i < results.length; i++) {
			result += results[i]['nome'];
			result += " ";
			result += results[i]['cognome'];
			if (i != (results.length-1)) {
				result += ", ";
			}
		}
		callback.apply(this, [result]);
	});
}

function render_film(res,result,callback) {
	var do2 = new combo.Combo(function(regista,cast) {
		res.write("<article>");
		res.write("<img src='/images/");
		res.write(result['Locandina']);
		res.write("'>");
		res.write("<h1>");
		res.write(result['Titolo']);
		res.write(" (");
		res.write(""+result['Anno']);
		res.write(")");
		res.write("</h1>");
		res.write("<p><strong>Regista:</strong>");
		res.write(regista[0]);
		res.write("</p>");
		res.write("<p><strong>Cast:</strong>");
		res.write(cast[0]);
		res.write("</p>");
		res.write("<p class='trama'>");
		res.write(result['Trama']);
		res.write("</p>");
		res.write("</article>");
		callback.apply();
	});
	
	get_regista(result['Film_ID'], do2.add());
	get_cast(result['Film_ID'], do2.add());
}

function body(res, ordinamento) {
		res.write("\
		<header>\
			<hgroup>\
				<h1>\
					<img src='/images/MyMovies_logo.png' >\
				</h1>\
			</hgroup>");
		res.write("<strong>Ordine</strong> ");
		res.write("<a href='"+ordinamento['link']+"'>"+ordinamento['desc']);
		res.write("</a>");
		res.write("</header>");
		res.write("<aside>");
		res.write("<form method='post' action='/filtra/'>");
		res.write("<label for='regista'>Regista</label>");
		res.write("<select name='regista'>");
		render_registi(res, function() {
			res.write("</select>");
			res.write("</form>");
			res.write("</aside>");
			queryAnno = "select * from film order by Anno desc";
			queryAlfabetico = "select * from film order by Titolo";
			client.query(ordinamento['key'] == 'Anno' ? queryAnno : queryAlfabetico ,function(err, results, fields) {
				if (!err) {
					var count = 0;
					for (var i = 0; i < results.length; i++) {
						var result = results[i];
						render_film(res,result,function() {
							count++;
							if (count == results.length) {
								footer(res);
							}
						});
					}
				}
			});
		});
		
}

function dispatch(req,res) {
	var myurl = url.parse(req.url);
	res.writeHead(200);
	res.write(header());
	if (myurl.pathname.match("^/ordina-per-nome/$")) {
		body(res, {link: '/ordina-per-data/',desc: 'Cronologico (dal pi&ugrave; recente)', key: 'Titolo'});
	} else {
		body(res, {link: '/ordina-per-nome/',desc: 'Alfabetico (dalla A alla Z)', key: 'Anno'});
	}
}

var server = http.createServer(function(req, res) {
	var myurl = url.parse(req.url);
	
	// invia il file se esiste localmente
	var localpath = myurl.pathname.substr(1);
	fs.readFile(localpath, function(err, data) {
		if (!err) {
			res.writeHead(200,{'Content-Type': mime.lookup(localpath)});
			res.end(data);
		} else {
			dispatch(req,res);
		}
	});
});
server.listen(8080);
