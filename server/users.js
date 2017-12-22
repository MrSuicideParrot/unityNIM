var fs = require('fs');
var crypto = require('crypto');

var util = require(__dirname+'/myExpress.js');

var pathDB = __dirname+"/users.json"

var usersDB = {};

var active = [];

function isValidUser(username){
  if (username in usersDB)
    return true;
  else
    return false;
}

function verify(username, password) {
  if (usersDB[username][0] === crypto.createHash('sha512').update(password+usersDB[username][1]).digest('hex')) {
    return true;
  }
  else {
    return false;
  }
}

function gensalt(){
  var salt = "";
  var pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 32; i++)
    salt += pool.charAt(Math.floor(Math.random() * pool.length));

  return salt;
}

function register(body, response) {
  try {
    body = JSON.parse(body);
  } catch (err) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Request body is malformed" }));
    return;
  }

  if (!('nick' in body)) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Nick is undefined" }));
    return;
  }


  if (!('pass' in body)) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Pass is undefined" }));
    return;
  }

  if (body['nick'] in usersDB) {
    //Utilizador já existe necessário verificar a pass
    let hashPass = crypto.createHash('sha512').update(body['pass']+usersDB[body['nick']][1]).digest('hex');

    if (usersDB[body['nick']][0] === hashPass) {
      response.writeHead(200);
      response.end(JSON.stringify({}));
    }
    else {
      response.writeHead(401);
      response.end(JSON.stringify({ "error": "User registered with a different password" }));
    }

  }
  else {
    //Criar utilizador
    salt = gensalt();
    usersDB[body['nick']] = [crypto.createHash('sha512').update(body['pass']+salt).digest('hex'),salt];
    response.writeHead(200);
    response.end(JSON.stringify({}));
    saveUsers();
  }
}

function turnActive(user) {
  for (var i in active){
    if(active[i] === user)
      return false;
  }
 
    active.push(user);
    return true;
  
}

function turnNotActive(user) {
  for (var i in active) {
    if (active[i] === user)
      active.splice(i,1);
  }
}

function loadUsers() {
  fs.readFile(pathDB, function (err, data) {
    if (!err) {
      usersDB = JSON.parse(data.toString());
    }
  });
}

function saveUsers() {
  fs.writeFile(pathDB, JSON.stringify(usersDB), function (err) {
    if (err) throw err;
  });
}

module.exports.verify = verify;
module.exports.register = register;
module.exports.loadUsers = loadUsers;
module.exports.turnActive = turnActive;
module.exports.turnNotActive = turnNotActive;
module.exports.isValidUser = isValidUser; 