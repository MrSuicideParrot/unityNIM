var fs = require('fs');
var crypto = require('crypto');

var util = require('./myExpress.js');

var pathDB = "users.json"

var usersDB = {};

function verify(username, password) {

}

function register(body, response) {
  body = JSON.parse(body);
  if ('nick' in body && 'pass' in body) {
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
  //retorna erro
}

function loadUsers() {

}

function saveUsers(){

}

module.exports.verify = verify;
module.exports.register = register;
module.exports.loadUsers = loadUsers;
