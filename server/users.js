var fs = require('fs');
var crypto = require('crypto');

var util = require('./myExpress.js');

var pathDB = "users.json"

var usersDB = {};

var active = [];

function verify(username, password) {
  if(usersDB[username] === crypto.createHash('md5').update(password).digest('hex')){
    return true;
  }
  else{
    return false;
  }
}

function register(body, response) {
  body = JSON.parse(body);

  if(!('nick' in body)){
    response.writeHead(400);
    response.end(JSON.stringify({"error":"Nick is undefined"}));
    return;
  }


  if(!('pass' in body)){
    response.writeHead(400);
    response.end(JSON.stringify({"error":"Pass is undefined"}));
    return;
  }

    if (body['nick'] in usersDB) {
      //Utilizador já existe necessário verificar a pass
      let hashPass = crypto.createHash('md5').update(body['pass']).digest('hex');

      if (usersDB[body['nick']] === hashPass) {
        response.writeHead(200);
        response.end(JSON.stringify({}));
      }
      else {
        response.writeHead(400);
        response.end(JSON.stringify({"error":"User registered with a different password"}));
      }

    }
    else{
      //Criar utilizador
      usersDB[body['nick']] = crypto.createHash('md5').update(body['pass']).digest('hex');
      response.writeHead(200);
      response.end(JSON.stringify({}));
      saveUsers();
    }

}

function turnActive(user) {
  if(user in active){
    return false;
  }
  else{
    active.push(user);
    return true;
  }
}

function turnNotActive(user) {

}

function loadUsers() {
   fs.readFile(pathDB, function(err,data) {
     if(! err) {
       usersDB = JSON.parse(data.toString());
     }
   });
}

function saveUsers(){
   fs.writeFile(pathDB,JSON.stringify(usersDB),function (err){
     if(err) throw err;
   });
}

module.exports.verify = verify;
module.exports.register = register;
module.exports.loadUsers = loadUsers;
module.exports.turnActive = turnActive;
