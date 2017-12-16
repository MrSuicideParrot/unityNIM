var db;

function connect(users) {
  db = users;
}

function join(body, response) {
  body = JSON.parse(body);

  //verificoes de usernames e passwords
  if(!'nick' in body){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Nick is undefined"}));
    return;
  }

  if(!'pass' in body){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Pass is undefined"}));
    return;
  }

  if(!db.verify(body['nick'], body['pass'])){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"User registered with a different password"}));
    return;
  }

}

function leave(body, response) {
  body = JSON.parse(body);
}

function update(response) {
  
}

module.exports.connect = connect;
module.exports.join = join;
module.exports.leave = leave;
module.exports.update = update;
