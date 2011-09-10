var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var combo = require('./combo');
var querystring = require('querystring');

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

	// determina se questo film va mostrato in base al filtro
	if (res.parametri['query']) {
		query = querystring.parse(res.parametri['query']);
		
		if (query['keyword'] && !result['Titolo'].toLowerCase().match(query['keyword'].toLowerCase()) && !result['Trama'].toLowerCase().match(query['keyword'].toLowerCase())) {
			callback.apply();
			return;
		}
	}

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

function render_registi(res, callback) {
	var par;
	if (res.parametri['query']) {
		par = querystring.parse(res.parametri['query']);
	}
	res.write("<option value=-1>Filtra per regista</option>");
	client.query("select distinct id_regista, nome, cognome from regista join personale on regista.id_regista = personale.id_personale order by cognome,nome", function(err,results,fie) {
		if (!err) {
			for (var i = 0; i < results.length; i++) {
				if (par && par['regista'] && par['regista'] == results[i]['id_regista']) {
					res.write("<option value="+results[i]['id_regista']+" selected >"+results[i]['cognome']+" "+results[i]['nome']+"</option>");
				} else {
					res.write("<option value="+results[i]['id_regista']+">"+results[i]['cognome']+" "+results[i]['nome']+"</option>");
				}
			}
		}
		callback.apply(this);
	});
}

function render_attore(res, callback) {
	var par;
	if (res.parametri['query']) {
		par = querystring.parse(res.parametri['query']);
	}
	res.write("<option value=-1>Filtra per attore</option>");
	client.query("select distinct id_attore, nome, cognome from cast join personale on cast.id_attore = personale.id_personale order by cognome,nome", function(err,results,fie) {
		if (!err) {
			for (var i = 0; i < results.length; i++) {
				if (par && par['attore'] && par['attore'] == results[i]['id_attore']) {
					res.write("<option value="+results[i]['id_attore']+" selected >"+results[i]['cognome']+" "+results[i]['nome']+"</option>");
				} else {
					res.write("<option value="+results[i]['id_attore']+">"+results[i]['cognome']+" "+results[i]['nome']+"</option>");
				}
			}
		}
		callback.apply(this);
	});
}

function body(res, parametri) {
		res.parametri = parametri;
		res.write("\
		<header>\
			<hgroup>\
				<h1>\
					<img src='/images/MyMovies_logo.png' >\
				</h1>\
			</hgroup>");
		res.write("<strong>Cambia Ordine</strong> ");
		res.write("<a href='"+parametri['link']+"'>"+parametri['desc']);
		res.write("</a>");
		res.write("</header>");
		res.write("<aside>");
		res.write("<form method='post' action='/filtra/'>");
		res.write("<label for='keyword'>Ricerca libera</label>");
		res.write("<input type='text' name='keyword'");
		if (res.parametri['query']) {
			var par = querystring.parse(res.parametri['query']);
			if (par && par['keyword'])
				res.write("value='"+par['keyword']+"'");
		}
		res.write("></input><br>");
		res.write("<label for='regista'>Regista</label>");
		res.write("<select name='regista'>");
		render_registi(res, function() {
			res.write("</select>");
			res.write("<br>");
			res.write("<label for='attore'>Attore</label>");
			res.write("<select name='attore'>");
			render_attore(res,function() {
				res.write("</select><br>");
				res.write("<button type='submit'>Filtra</button>");
				res.write("</form>");
				res.write("</aside>");
				queryAnno = "select * from film order by Anno desc";
				queryAlfabetico = "select * from film order by Titolo";
				client.query(parametri['key'] == 'Anno' ? queryAnno : queryAlfabetico ,function(err, results, fields) {
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
		});
		
}

function dispatch(req,res) {
	var myurl = url.parse(req.url);
	res.writeHead(200);
	res.write(header());
	if (myurl.pathname.match("^/ordina-per-nome/$")) {
		body(res, {link: '/ordina-per-data/',desc: 'Cronologico (dal pi&ugrave; recente)', key: 'Titolo'});
	} else if (myurl.pathname.match("^/ordina-per-data/$")) {
		body(res, {link: '/ordina-per-nome/',desc: 'Alfabetico (dalla A alla Z)', key: 'Anno'});
	} else if (myurl.pathname.match("^/filtra/$")) {
		body(res, {link: '/ordina-per-nome/',desc: 'Alfabetico (dalla A alla Z)', key: 'Anno', query: req.content});
	} else {
		body(res, {link: '/ordina-per-data/',desc: 'Cronologico (dal pi&ugrave; recente)', key: 'Titolo'});
	}
}

var server = http.createServer(function(req, res) {
	req.setEncoding('utf8');
	req.content = '';
	
	req.on('data', function(data) {req.content += data});
	req.on('end', function() {
	
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
});
server.listen(8080);
