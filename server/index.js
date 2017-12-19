var port = 8002;

var http = require('http');
var url = require('url');

var users = require('./users.js')
var express = require('./myExpress.js')
var game = require('./game.js')

users.loadUsers();
game.connect(users);

http.createServer(
  function(request, response) {
    //Verificar se o metodo é o mesmo que nos queremos
    var parsedUrl = url.parse(request.url,true);
    switch (parsedUrl.pathname) {
      case "/ranking":

        break;

      case "/join":
        express.body(request, response, game.join);
        break;

      case "/register":
        express.body(request, response, users.register);
        break;

      default:
          response.writeHead(404, "pedido desconhecido");
          response.end();
          break;
    }
  }
).listen(port);
