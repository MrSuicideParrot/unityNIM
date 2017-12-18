var port = 8002;

var http = require('http');
var url = require('url');

var users = require('./users.js')
var ranking = require('./ranking.js')
var express = require('./myExpress.js')

users.loadUsers();
ranking.loadrankings();

http.createServer(
  function(request, response) {
    //Verificar se o metodo é o mesmo que nos queremos
    var parsedUrl = url.parse(request.url,true);
    switch (parsedUrl.pathname) {
      case "/ranking":
        express.body(request, response, ranking.rankings)
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
