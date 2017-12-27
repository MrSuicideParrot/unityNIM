var port = 8002;

var http = require('http');
var url = require('url');

var users = require(__dirname + '/users.js');
var ranking = require(__dirname + '/ranking.js');
var express = require(__dirname + '/myExpress.js');
var game = require(__dirname + '/game.js');

users.loadUsers();
ranking.loadrankings();
game.connect(users, ranking);


http.createServer(
  function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Content-Type', 'application/javascript');

    //Verificar se o metodo é o mesmo que nos queremos
    var parsedUrl = url.parse(request.url, true);
    if (request.method === 'POST') {
      switch (parsedUrl.pathname) {
        case "/ranking":
          express.body(request, response, ranking.rankings)
          break;

        case "/join":
          express.body(request, response, game.join);
          break;

        case "/register":
          express.body(request, response, users.register);
          break;

        /* case "/update":
           game.update(parsedUrl.query.game, parsedUrl.query.nick, request, response);
           break;*/

        case "/notify":
          express.body(request, response, game.notify);
          break;

        case "/leave":
          express.body(request, response, game.leave);
          break;

        default:
          response.writeHead(404, "pedido desconhecido");
          response.end();
          break;
      }
    }
    else if (request.method === 'GET' && parsedUrl.pathname === '/update') {
      game.update(parsedUrl.query.game, parsedUrl.query.nick, request, response);
    }
    else {
      response.writeHead(404, "pedido desconhecido");
      response.end();
    }
  }
).listen(port);
