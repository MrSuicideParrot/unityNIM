
/* VAriavies globais */
var tamanho = 4;
var current_tabuleiro;
var game_type = 0;
var piramide = true;
var first_to_play = 0; //0 - jogador 1 , 1 - jogador 2 / maquina
var dificult_level = 100; // 0 - random , 50 - as vezes faz random outras vezes faz a pensar, 100 - pensa sempre
var beautiful_API = {
  1:['Admin',0],
};

function Tabuleiro(){
  var parent_element = document.getElementById('tabuleiro');
  this.pecas_array = Array();

  while (parent_element.hasChildNodes()) {
    parent_element.removeChild(parent_element.lastChild);
  }

  var length_next = 0;
  for (var i = 0; i < tamanho; i++) {
    var linha = document.createElement("tr");
    if(!piramide)
    length_next =  Math.floor((Math.random() * tamanho) + 1);
    else
    ++length_next;
    auxiliar = Array();
    for (var j = 0; j < length_next; j++) {
      var elemento_td = document.createElement("td");
      var elemento = document.createElement("div");
      elemento.setAttribute("class", "peca_jogo");

      elemento.setAttribute("onclick","move('"+i+" "+j+"')");

      auxiliar.push(elemento);
      elemento_td.appendChild(elemento);
      linha.appendChild(elemento_td);
    }
    this.pecas_array.push(auxiliar);
    parent_element.appendChild(linha);
  }
}

Tabuleiro.prototype.give_up = function () {
  change_msg(-1);
  var parent_element = document.getElementById('tabuleiro');
  while (parent_element.hasChildNodes()) {
    parent_element.removeChild(parent_element.lastChild);
  }
  document.getElementById('game_continue').style.display = 'none';
  document.getElementById('game_restart').style.display = 'inline';
}

Tabuleiro.prototype.not_empty_line = function () {
  for(var i in this.pecas_array){
    if(this.pecas_array[i].length!==0)
    return i;
  }
}

Tabuleiro.prototype.user_play = function(clicked_id, machine){
  clicked_id = clicked_id.split(" ");
  var i = parseInt(clicked_id[0]);
  var j = parseInt(clicked_id[1]);
  if(this.pecas_array[i][j].style.visibility == "hidden")
  return false;

  for (var k=j ;k<this.pecas_array[i].length;++k){
    this.pecas_array[i][k].style.cursor= "auto";
    this.pecas_array[i][k].style.visibility= "hidden";
  }
  this.pecas_array[i].splice(j,this.pecas_array[i].length-j);

  if(machine){
    if(current_tabuleiro.is_tabuleiro_empty()){
      change_msg(2);
      document.getElementById('game_continue').style.display = 'none';
      document.getElementById('game_restart').style.display = 'inline';
      return;
    }

    //unlock tabuleiro
    current_tabuleiro.lock =0;
  }
  return true;
}

Tabuleiro.prototype.lock = 1;

Tabuleiro.prototype.is_tabuleiro_empty = function(){
  var count = 0;

  for (var seg in this.pecas_array)
  count += this.pecas_array[seg].length;

  if(count==0)
    return true;

  return false;
}

Tabuleiro.prototype.random_pos = function() {
  var count = 0;
  while(true){
    var i = Math.floor((Math.random() * tamanho));
    if (this.pecas_array[i].length != 0){
      break;
    }
    if(count>=4){
      i = this.not_empty_line();
      break;
    }
    count++;
  }

  count = 0;
  while(true){
    var j = Math.floor((Math.random() * tamanho));
    if (this.pecas_array[i][j]!= null){
      break;
    }
    if(count>=4){
      j=0;
      break;
    }
    count++;
  }
  return [i,j];
}

Tabuleiro.prototype.pecas_array = Array();

Tabuleiro.prototype.machine_play = function(){
  var sorte = Math.floor((Math.random() * 100));
  var play;

  if (sorte < dificult_level){
    var contas = Array();
    var resultado = Array();

    //heuristica

    //Conversão para binário
    for(var i = 0; i <this.pecas_array.length; ++i){
      var numero = this.pecas_array[i].length;
      contas[i] = Array();

      for(var j = Math.trunc(Math.log2(tamanho))+1; j >0; --j){
        var [resto, quociente] = division(numero);
        contas[i][j] = resto;
        numero = quociente;
      }
      contas[i][j] = numero;
    }

    for (var i = 0; i < contas.length; i++) {
      for (var j = 0; j < contas[0].length; j++) {
        resultado[j] ^= contas[i][j];
      }
    }

    if(sumArray(resultado) === 0){
      [i,j] = this.random_pos();
    }
    else{
      //escolher linha
      var pos_final = Array();

      for (var i = 0; i < contas[0].length; i++) { //Colunas
        var pos_inter = Array();
        for (var j = 0; j < contas.length; j++) { //linhas
          //resultado[i]
          if(resultado[i]==1 && contas[j][i]==1 && (pos_final.length === 0| pos_final.includes(j))){
            pos_inter.push(j);
          }
        }
        //esta errado tens de pensar
        if(pos_inter.length !==0 && pos_final.length !== pos_inter.length){
            if(pos_final.length === 0){
                pos_final = pos_inter;
            }
            else{
                remIndex = Array();
                for (var v in pos_final) {
                    if(pos_inter.includes(pos_final[v])){
                        remIndex.push(pos_final[v]);
                    }
                }
                pos_final = remIndex;
            }
        }
        if(pos_final.length === 1)
        break;
      }

      var l_target = pos_final.pop();

      //Colunaa
      var target = contas[l_target]; //alvo a alterar
      var inicial = toBin(target);
      for(var t=0; t<target.length; ++t){
        if(resultado[t] === 1)
        target[t] = target[t]===1 ? 0 : 1;
      }

      var final = toBin(target);

      i = l_target;
      j = this.pecas_array[l_target].length - (inicial - final)

    }
  }
  else{

    [i,j] = this.random_pos();
  }

  this.pecas_array[i][j].style.background="white";
  this.pecas_array[i][j].style.borderStyle="solid";
  this.pecas_array[i][j].style.borderColor="#f07057";
  play = i+" "+j;
  setTimeout(function() {
    current_tabuleiro.user_play(play, true);
  }, 1250);
}

function login() {
  var username = document.getElementById("login_form").username.value;
  var password = document.getElementById("login_form").password.value;

  registerApi(username, password);
}

function changeToLoged(username){
  user = username;
  document.getElementById('registo').style.display = "none";
  document.getElementById('login_form').style.display = "none";
  document.getElementById('barra_lateral').style.display = "inline";
  document.getElementById('initial_play').style.display = "inline";
  document.getElementById('login_').innerHTML += ('Welcome, '+user+"!");
  document.getElementById('right_side').style.display = "inherit";
}

function close_panels(){
  choose_settings();
  var elements = document.getElementsByClassName('panel')
  for (var i = 0; i < elements.length ; ++i) {
    elements[i].style.display = "none";
  }
}


function open_scores(){
  close_panels();
  beautiful_API = rankingAPI(tamanho);
  tableScore.init();
  sort_scores();
  document.getElementById('scores').style.display = "inherit";
}

function open_config(){
  close_panels();

  var painel = document.getElementById('configuracao');
  // Inicialização do form

  painel.style.display = "inline";

}

function open_info(){
  close_panels();
  document.getElementById('info').style.display = "inline";
}

function flip_adv(){
  if(document.getElementById('game_machine').checked){
    document.getElementById('div_dificult').style.display = 'inherit';
    game_type = 0;
  }
  else if(document.getElementById('game_human').checked){
    document.getElementById('div_dificult').style.display = 'none';
    game_type = 1;
  }
}

function get_game_type(id_name){
  if(document.getElementById(id_name).checked){
    return 0;
  }
  return 1;
}

function choose_settings(){
  tamanho = document.getElementById('board_size').options[document.getElementById('board_size').selectedIndex].value;
  randomState();
  game_type = get_game_type('game_machine');
  dificult_level = document.getElementById('game_difficulty').options[document.getElementById('game_difficulty').selectedIndex].value;
  first_to_play = get_game_type('first_start');
}

function display_game() {
  close_panels();
  document.getElementById('tabuleiro_div').style.display = 'table';
}

function init_game(){
  document.getElementById('game_start').style.display = 'none';
  document.getElementById('game_restart').style.display = 'none';
  document.getElementById('game_continue').style.display = 'inline';
  current_tabuleiro = new Tabuleiro();
  if(first_to_play === 1){
    current_tabuleiro.machine_play();
  }
  current_tabuleiro.lock = 0;
  change_msg(0);
}

function move(clicked_id){
  if(current_tabuleiro.lock !== 0){
    change_msg(-2);
    setTimeout(function(){change_msg(0)},1000);
    return;
  }

  // Lock tabuleiro
  current_tabuleiro.lock = 1;

  var flag = current_tabuleiro.user_play(clicked_id, false);
  if(current_tabuleiro.is_tabuleiro_empty() && flag){
    addpointstouser();
    change_msg(1);
    document.getElementById('game_continue').style.display = 'none';
    document.getElementById('game_restart').style.display = 'inline';
    return;
  }
  current_tabuleiro.machine_play(clicked_id);

}

function changeBoardSize() {
  tamanho = document.getElementById('board_size').selectedIndex+3;
}

function changeDificult() {
  dificult_level = document.getElementById('game_difficulty').selectedIndex*3;
}

function changeWhoStart(){
  if(document.getElementById('first_start').checked){
    first_to_play = 0;
  }
  else{
    first_to_play = 1;
  }
}
const tableScore ={
  init:function(){
    table = document.getElementById('scores_table');

    while (table.hasChildNodes()) {
      table.removeChild(table.lastChild);
    }

    var cabecalho = document.createElement('tr');

    var aux = document.createElement('th');
    aux.textContent = 'Player';
    cabecalho.appendChild(aux);

    aux = document.createElement('th');
    aux.textContent = 'Score';
    cabecalho.appendChild(aux);

    table.appendChild(cabecalho);

    for(var i in beautiful_API){
      cabecalho = document.createElement('tr');
      aux = document.createElement('td');
      aux.textContent = beautiful_API[i][0];
      cabecalho.appendChild(aux);

      aux = document.createElement('td');
      aux.textContent = beautiful_API[i][1];
      cabecalho.appendChild(aux);

      table.appendChild(cabecalho);
    }
  }
}

function sort_scores(){
  var stable, rows, sflag, i, x, y, to_switch;
  stable = document.getElementById("scores_table");
  sflag = true;
  while(sflag){
    sflag = false;
    rows = stable.getElementsByTagName("tr");
    for(i=1; i<(rows.length-1); i++){
      to_switch = false;
      x = rows[i].getElementsByTagName("td")[1];
      y = rows[i+1].getElementsByTagName("td")[1];
      if(parseInt(x.innerHTML) < parseInt(y.innerHTML)){
        to_switch = true;
        break;
      }
    }
    if(to_switch){
      rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
      sflag = true;
    }
  }

  for(i=1; i<(rows.length); i++){
    rows[i].getElementsByTagName("td")[0].innerText = i + '.' + rows[i].getElementsByTagName("td")[0].innerText;
  }
}

function change_pos(cell, pos){
  var i;
  for(i=0; i<(cell.innerText.length-1); i++){
    if(cell.innerText[i] == '.')
    break;
  }
  cell.innerText = pos + cell.innerText.substr(i,cell.innerText.length-1);
}


function addpointstouser(){
  if(dificult_level == 100){
    //add 3
    points_incr(3);
  }
  else if(dificult_level == 50){
    //add 2
    points_incr(2);
  }
  else{
    //add 1
    points_incr(1);
  }
}

function points_incr(p){
  for(var i in beautiful_API){
    if (beautiful_API[i][0] == 'Admin'){
      beautiful_API[i][1]+=p;
      break;
    }
  }
}

function change_msg(val){
  if(val==1){
    document.getElementById("message_board").innerText = "You won the game!!!"
  }
  else if(val==2) {
    document.getElementById("message_board").innerText = "The machine won the game!!!"
  }
  else if(val==-1) {
    document.getElementById("message_board").innerText = "You gave up (and lost)."
  }
  else if(val==-2) {
    document.getElementById("message_board").innerText = "Play not possible (opponents turn)!"
  }
  else if(val==0) {
    document.getElementById("message_board").innerText = ""
  }
}


// ***** INIT DA FUNÇÃO ******
window.onload = function(){
  //Atualizar setitings
  document.getElementById('board_size').selectedIndex = tamanho-3;

  if(document.getElementById('game_machine').checked){
    if(game_type!==0){
      flip_adv();
    }
  }
  else{
    if(game_type!==1){
      flip_adv();
    }
  }

  // Dificuldade
  if(document.getElementById('game_difficulty').options[document.getElementById('game_difficulty').selectedIndex] !== dificult_level){
    switch (dificult_level) {
      case 0:
      document.getElementById('game_difficulty').selectedIndex = 0;
      break;

      case 50:
      document.getElementById('game_difficulty').selectedIndex = 1;
      break;

      case 100:
      document.getElementById('game_difficulty').selectedIndex = 2;
      break;
      default: break;
    }
  }

  //inicializar first to start - confirmar pensamento logico
  if(document.getElementById('first_start').checked){
    if(first_to_play!==0){
      document.getElementById('first_start').checked = false;
      document.getElementById('second_start').checked = true;

    }
  }
  else{
    if(first_to_play!==1){
      document.getElementById('first_start').checked = true;
      document.getElementById('second_start').checked = false;
    }
  }

  if(piramide){
    document.getElementById("random_mode").checked = false;
  }
  else{
    document.getElementById("random_mode").checked = true;
  }

}

function randomState(){
  if(document.getElementById("random_mode").checked){
    piramide = false;
  }
  else{
    piramide = true;
  }
}
