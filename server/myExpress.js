function body(request, response, act){
    let body = [];
    request.on('error', function(err) {
        console.error(err);
    });

    request.on('data', function(chunk) {
      body.push(chunk);
    });

    request.on('end', function() {
      body = Buffer.concat(body).toString();
      act(body, response);
    });
}

function SSEClient(req, response) {
  req.socket.setNoDelay(true);

  this.res = response;
  
  this.res.writeHead(200, {
    'Content-Type': 'text/event-stream', 
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  this.res.write(':ok\n\n')
  this.id = 0
  this.send("{}")
}

/**
 * @param {String} data 
 */
SSEClient.prototype.send = function (data) {
  var toSend = `id: ${this.id++}\n\n`
  toSend += "data: " + data + "\n\n"
  this.res.write(toSend)
}

SSEClient.prototype.close = function () {
  this.res.end()
}

module.exports.body = body;
module.exports.SSEClient = SSEClient;