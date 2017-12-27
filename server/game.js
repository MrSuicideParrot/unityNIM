var crypto = require('crypto');
var express = require(__dirname + '/myExpress.js');

var rak;
var db; //Ligação aos modulo users

var dbGames = {} //Jogos em espera
var games = {} //Jogos ativos

function connect(users, ranking) {
  db = users;
  rak = ranking;
}

//Command Join
function join(body, response) {

  try {
    body = JSON.parse(body);
  } catch (err) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Request body is malformed" }));
    return;
  }

  //verificoes de usernames e passwords
  if (!('nick' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Nick is undefined" }));
    return;
  }

  if (!('pass' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Pass is undefined" }));
    return;
  }

  if (!db.verify(body['nick'], body['pass'])) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "User registered with a different password" }));
    return;
  }

  if (!('group' in body) || parseInt(body['group']) < 1) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Group is undefined" }));
    return;
  }

  if (!('size' in body) || parseInt(body['size']) < 3) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Size is undefined" }));
    return;
  }

  if (!db.turnActive(body['nick'])) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "You cannot play against yourself!" }));
    return;
  }

  var game = retrieveGame(body['group'], body['size'], body['nick']);
  response.writeHead(200);
  response.end(JSON.stringify({ "game": game }));
}


/**
* @param {String} group
* @param {String} size
* @param {String} user
*/
function retrieveGame(group, size, user) {
  var code;

  if (dbGames[group] !== undefined && dbGames[group][size] !== undefined && dbGames[group][size].length != 0) {
    var jo = dbGames[group][size].shift();
    jo.users.push(user);
    code = jo.id;
  }
  else {
    code = user + group + size + getDateTime();
    code = crypto
      .createHash('md5')
      .update(code)
      .digest('hex');

    if (dbGames[group] === undefined)
      dbGames[group] = {};

    tmp = new Jogo(code, size, user, group);
    games[code] = tmp;
    dbGames[group][size] = [tmp];
  }

  return code;
}

function notify(body, response) {
  try {
    body = JSON.parse(body);
  } catch (err) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Request body is malformed" }));
    return;
  }

  if (!('nick' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Nick is undefined" }));
    return;
  }

  if (!('pass' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Pass is undefined" }));
    return;
  }

  if (!db.verify(body['nick'], body['pass'])) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "User registered with a different password" }));
    return;
  }

  if (!('game' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Game is undefined" }));
    return;
  }

  if (!('stack' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Stack is undefined" }));
    return;
  }

  if (!('pieces' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Pieces is undefined" }));
    return;
  }

  if (games[body['game']] === undefined) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Game not found" }));
    return;
  }

  /* --------------------- FALTA   VERIFICAR SE SÂO NUMEROS STACK E PIECES  e se o nick pertence a este jogo----------------------*/

  if (games[body['game']].isHerTurn(body['nick'])) {
    stack = body['stack'] * 1;
    pieces = body['pieces'] * 1;

    if (!games[body['game']].numValid(stack, pieces)) {
      /*----------------ERRRRRORRRRRR------------------------*/
      response.writeHead(401); /* ------------- NAO ME LEMBRO DO CODIGO DE ERRO --------------------*/
      response.end(JSON.stringify({ "error": "Invalid move" }));
      return;
    }

    games[body['game']].update(stack, pieces);
  }
  else {
    response.writeHead(401); /* ------------- NAO ME LEMBRO DO CODIGO DE ERRO --------------------*/
    response.end(JSON.stringify({ "error": "Not your turn to play" }));
    return;
  }

  response.writeHead(200);
  response.end(JSON.stringify({}));
}

function update(game, nick, request, response) {
  if (nick === undefined || !db.isValidUser(nick)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Nick is undefined" }));
    return;
  }

  /* -------------- VERIFICAR SE ESTE USER PERTENCE A ESTE JOGO -------------------------*/

  if (game in games) {
    games[game].addListener(new express.SSEClient(request, response));
  }
  else {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Game is undefined" }));
    return;
  }
}

function leave(body, response) {
  try {
    body = JSON.parse(body);
  } catch (err) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Request body is malformed" }));
    return;
  }

  if (!('nick' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Nick is undefined" }));
    return;
  }

  if (!('pass' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Pass is undefined" }));
    return;
  }

  if (!db.verify(body['nick'], body['pass'])) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "User registered with a different password" }));
    return;
  }

  if (!('game' in body)) {
    response.writeHead(401);
    response.end(JSON.stringify({ "error": "Game is undefined" }));
    return;
  }

  if (games[body['game']] === undefined) {
    response.writeHead(400);
    response.end(JSON.stringify({ "error": "Game not found" }));
    return;
  }

  var am = games[body["game"]];
  var dados = {}

  /* Se ouver mais que um jogador sinaliza o que não desistiu
  como vencedor caso contrário dá o winner como null */
  for (var i in am.users) {
    if (am.users[i] !== body['nick']) {
      dados["winner"] = am.users[i];
      rak.rankupdate(dados["winner"], body['nick'],this.size);
      break;
    }
  }

  if (!("winner" in dados)) {
    dados["winner"] = null;
    dbGames[am.g][am.size].shift(); //remover dos jogos em espera
  }

  for (var i in am.SSEcl) { // Fecha os SSE correntes que existirem e envia o vencerdor
    am.SSEcl[i].send(JSON.stringify(dados));
  }

  am.cleanExit();

  response.writeHead(200);
  response.end(JSON.stringify({}));
}

function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function Jogo(id, d, user, group) {
  this.id = id;
  this.size = d;
  this.rack = [];
  this.g = group;

  //init
  this.nPecas = 0;
  this.users = [];
  this.SSEcl = [];

  for (var i = 1; i <= d; ++i) {
    this.rack.push(i);
    this.nPecas += i;
  }

  this.turn = 0;
  this.users.push(user);

  var am = this;
  //timeout
  this.timeout = setTimeout(function () {
    dbGames[am.g][am.size].shift();

    for (var i in am.SSEcl) { // Fecha os SSE correntes que existirem e envia o vencerdor
      am.SSEcl[i].send(JSON.stringify({ "winner": null }));
    }

    am.cleanExit();
  }, 120000);

}

//Tem de se prevenir mais que dois??
Jogo.prototype.addListener = function (s) {
  this.SSEcl.push(s);
  if (this.SSEcl.length === 2) {
    this.start();
    clearTimeout(this.timeout);

    am = this;
    //timeout de 2 minutos para um jogo senão é eliminado de forma automatica
    this.timeout = setTimeout(function () {

      for (var i in am.SSEcl) { // Fecha os SSE correntes que existirem e envia o vencedor
        am.SSEcl[i].send(JSON.stringify({ "winner": null }));
      }

      am.cleanExit();
    }, 120000);

  }
}

Jogo.prototype.start = function () {
  this.SSEcl[0].send(JSON.stringify({ "turn": this.users[this.turn], "rack": this.rack }));
  this.SSEcl[1].send(JSON.stringify({ "turn": this.users[this.turn], "rack": this.rack }));
}

/**
 * 
 * @param {Integer} stack 
 * @param {Integer} pecas 
 */
Jogo.prototype.update = function (stack, pecas) {
  this.nPecas = this.nPecas - (this.rack[stack] - pecas);
  this.rack[stack] = pecas;

  var dados = {
    "rack": this.rack,
    "stack": stack,
    "pieces": pecas,
  }

  if (this.nPecas === 0) {
    dados["winner"] = this.users[this.turn];
    rak.rankupdate(dados["winner"],this.users[this.turn == 0 ? 1 : 0],this.size)
  }
  else {
    /* ---------------------------------------- AVALIAR SE MANTEM SE POR ESTA ORDEM --------------------------*/
    this.turn = this.turn == 0 ? 1 : 0;
    dados["turn"] = this.users[this.turn];
  }

  this.SSEcl[0].send(JSON.stringify(dados));
  this.SSEcl[1].send(JSON.stringify(dados));


  if (this.nPecas === 0) {
    this.cleanExit();
  }
}

Jogo.prototype.cleanExit = function () {
  for (var i in this.users) {
    db.turnNotActive(this.users[i]);
  }

  /* for (var i in this.SSEcl) {
     this.SSEcl[i].close();
   }*/

  id = this.id;
  delete games[id];
}

Jogo.prototype.numValid = function (stack, pecas) {
  if (stack >= 0 && stack < this.size && pecas >= 0 && pecas < this.rack[stack]) {
    return true;
  }
  else {
    return false;
  }
}

Jogo.prototype.isHerTurn = function (user) {
  return this.users[this.turn] === user ? true : false;
}

module.exports.connect = connect;
module.exports.join = join;
module.exports.leave = leave;
module.exports.update = update;
module.exports.notify = notify;
module.exports.leave = leave;
