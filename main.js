
/* VAriavies globais */
var tamanho = 4;
var pecas_array = Array();
var game_type = 0;
var dificult_level = 0; // 0 - random , 1 - as vezes faz random outras vezes faz a pensar, 2 - pensa sempre

function login() {
    user = "Admin";
    document.getElementById('registo').style.display = "none";
    document.getElementById('login_form').style.display = "none";
    document.getElementById('barra_lateral').style.display = "inline";
    document.getElementById('initial_play').style.display = "inline";
    document.getElementById('login_').innerHTML += ('Welcome, '+user+"!");
    document.getElementById('right_side').style.display = "inherit";
  /*  document.getElementById('tabuleiro_div').style.display = 'table';  */
}

function close_panels(){
    var elements = document.getElementsByClassName('panel')
    for (var i = 0; i < elements.length ; ++i) {
        elements[i].style.display = "none";
    }
}


function open_config(){
    close_panels();

    var painel = document.getElementById('configuracao');
    // Inicialização do form

    painel.style.display = "inline";

}


function generate_table(){
  var parent_element = document.getElementById('tabuleiro');

  while (parent_element.hasChildNodes()) {
    parent_element.removeChild(parent_element.lastChild);
  }

   for (var i = 0; i < tamanho; i++) {
      var linha = document.createElement("tr");
      var length_next =  Math.floor((Math.random() * tamanho) + 1);

	auxiliar = Array();
      for (var j = 0; j < length_next; j++) {
        var elemento_td = document.createElement("td");
        var elemento = document.createElement("div");
	elemento.setAttribute("class", "peca_jogo");
	elemento.setAttribute("id",i+" "+j);
	elemento.setAttribute("onclick","user_play(this.id)");
        elemento.textContent="Life";
	auxiliar.push(elemento);
	elemento_td.appendChild(elemento);
        linha.appendChild(elemento_td);
      }
	pecas_array.push(auxiliar);
      parent_element.appendChild(linha);
  }
}

function display_game() {
  close_panels();
  document.getElementById('tabuleiro_div').style.display = 'table';
}

function init_game(){
  document.getElementById('game_start').style.display = 'none';
  document.getElementById('game_continue').style.display = 'inline';
  generate_table();
}

function user_play(clicked_id){
	clicked_id = clicked_id.split(" ");
	var i = parseInt(clicked_id[0]);
	var j = parseInt(clicked_id[1]);
	
	for (var k=j ;k<pecas_array[i].length;++k){
	//	pecas_array[i][k].parentNode.removeChild(pecas_array[i][k]);
		pecas_array[i][k].style.display= "none";
	 }
	pecas_array[i].splice(j,pecas_array[i].length-j);

	if(is_tabuleiro_empty())
		alert("Parabéns, ganhou!!!");
		return;

	// computer time
	if(game_type == 0){
		super_IA();		
	}
	
}

function is_tabuleiro_empty(){
	var count = 0;
	
	for (var seg in pecas_array)
		count += seg.length;

	if(count==0)
		return true;
	
	return false;
}

function super_IA(){
	var sorte = Math.floor((Math.random() * 100));
	if (sorte < dificult_level){

	}
	else{
		while(true){
			var i = Math.floor((Math.random() * tamanho));
			if (pecas_array[i].length != 0){
				break;
			}
		}

		while(true){
			var j = Math.floor((Math.random() * tamanho));
			if (pecas_array[i][j]!= null){
				break;
			}
		}
		
		user_play(i+" "+j);

	}
}
