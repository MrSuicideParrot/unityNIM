var port = 8002;

var http = require('http');
var url = require('url');

var users = require('./users.js')

http.createServer(
  function(request, response) {
    //Verificar se o metodo é o mesmo que nos queremos
    var parsedUrl = url.parse(request.url,true);
    switch (parsedUrl.pathname) {
      case "/ranking":

        break;

      case "/register":
        users.register(request, response);
        break;

      default:
          response.writeHead(404, "pedido desconhecido");
          response.end();
          break;
    }
  }
).listen(port);
