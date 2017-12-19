var crypto = require('crypto');
var express = require('./myExpress.js')

var db; //Ligação aos modulo users

var dbGames = {} //Jogos em espera
var games = {} //Jogos ativos

function connect(users) {
  db = users;
}

//Command Join
function join(body, response) {
  /*
            PARA FAZER VERIFICAR SE O SIZE E O GROUP SÂO NUEMROS
  */
  body = JSON.parse(body);

  //verificoes de usernames e passwords
  if(!('nick' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Nick is undefined"}));
    return;
  }

  if(!('pass' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Pass is undefined"}));
    return;
  }

  if(!db.verify(body['nick'], body['pass'])){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"User registered with a different password"}));
    return;
  }

  if(!('group' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Group is undefined"}));
    return;
  }

  if(!('size' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Size is undefined"}));
    return;
  }

  if(!db.turnActive(body['nick'])){
    //Não pode jogar consigo mesmo
    return;
  }

  var game = retrieveGame(body['group'], body['size'], body['nick']);
  response.writeHead(200);
  response.end(JSON.stringify({"group":game}));
}


/**
* @param {String} group
* @param {String} size
* @param {String} user
*/
function retrieveGame(group, size, user){
  var code;

  if(dbGames[group] !== undefined && dbGames[group][size] !== undefined && dbGames[group][size].length != 0){
    jo = dbGames[group][size].shift()
    jo.users.push(user);
    //code = jo.id;
    //games[code] = jo;
  }
  else{
    code = user + group + size + getDateTime();
    code = crypto
               .createHash('md5')
               .update(size)
               .digest('hex');

    if(dbGames[group]===undefined)
      dbGames[group] = {};

    tmp = new Jogo(code, size, user);
    games[code] = tmp;
    dbGames[group][size] = [tmp];
  }

  return code;
}

function leave(body, response) {
  body = JSON.parse(body);
}

function notify(body, response){
  body = JSON.parse(body);

  if(!('nick' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Nick is undefined"}));
    return;
  }

/*  if(!('pass' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Pass is undefined"}));
    return;
  }

  if(!db.verify(body['nick'], body['pass'])){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"User registered with a different password"}));
    return;
  }*/

  if(!('game' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Game is undefined"}));
    return;
  }

  if(!('stack' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Stack is undefined"}));
    return;
  }

  if(!('pieces' in body)){
    response.writeHead(401);
    response.end(JSON.stringify({"error":"Pieces is undefined"}));
    return;
  }



}

function update(game, nick, request, response) {
  if (nick === undefined || !db.isValidUser(nick)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Nick is undefined" }));
    return;
  }

  if(game in games){
    games[game].addListener(new express.SSEClient(require, response));
  }
  else{
    //Jogo invalido
  }
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function Jogo(id, d, user) {
  this.id = id;
  this.d = d;
  this.turn = user;
  this.users.push(user);
}

Jogo.prototype.users = [];
Jogo.prototype.SSEcl = [];

Jogo.prototype.addListener = function (s){
  this.SSEcl.push(s);
  if(this.SSEcl.length === 2){
    //começa o jogo
  }
}



module.exports.connect = connect;
module.exports.join = join;
module.exports.leave = leave;
module.exports.update = update;
