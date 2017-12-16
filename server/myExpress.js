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

module.exports.body = body;
