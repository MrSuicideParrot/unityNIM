
/* VAriavies globais */
var tamanho = 4;
var current_tabuleiro;
var game_type = 0;
var dificult_level = 0; // 0 - random , 1 - as vezes faz random outras vezes faz a pensar, 2 - pensa sempre

const Tabuleiro = {
    init: function(){
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
              elemento.setAttribute("onclick","move(this.id)");
              elemento.textContent="Life";
              auxiliar.push(elemento);
              elemento_td.appendChild(elemento);
              linha.appendChild(elemento_td);
            }
            this.pecas_array.push(auxiliar);
            parent_element.appendChild(linha);
        }
    },

    user_play: function(clicked_id){
        clicked_id = clicked_id.split(" ");
        var i = parseInt(clicked_id[0]);
        var j = parseInt(clicked_id[1]);

        for (var k=j ;k<this.pecas_array[i].length;++k){
        //	pecas_array[i][k].parentNode.removeChild(pecas_array[i][k]);
            this.pecas_array[i][k].style.display= "none";
         }
        this.pecas_array[i].splice(j,pecas_array[i].length-j);

        if(is_tabuleiro_empty())
            alert("Parabéns, ganhou!!!");
            return;

        /* computer time
        if(game_type == 0 && go){
            this.machine_play();
        }*/
    },

    is_tabuleiro_empty:function(){
    	var count = 0;

    	for (var seg in this.pecas_array)
    		count += seg.length;

    	if(count==0)
    		return true;

    	return false;
    },

    machine_play:function(){
        var sorte = Math.floor((Math.random() * 100));
        if (sorte < dificult_level){
            play = function(){
                var contas = Array();
                var resultado = Array();

                 for(var i = 0; i <this.pecas_array.length; ++i){
                    number = this.pecas_array[i].length;
                    contas[i] = Array();
                    // 0 -> 4 1 -> 2 2-> 1
                    contas[i][0] = (number/4)|0;
                    number = number % 4;
                    contas[i][1] = (number/2)|0;
                    number = number % 2;
                    contas[i][1] = number;
                 }

                 for (var i = 0; i < 3; i++) {
                     for (var j = 0; j < contas; j++) {
                         resultado ^= contas[j][i];
                     }
                 }

                 var sum = sumArray(resultado);

                 //var remover = Array();
                 if(sum == 0){
                     for (var i in contas) {
                         sum.push(sumArray(i));
                     }
                     indice = indexOfMax(sum, true);
                 }
                 else{
                     sum = initialize_Array(contas.length, 0);
                     for (var i = 0; i < contas.length; i++) {
                         for (var j = 0; j < 3; j++) {
                             if (resultado[j]!=0) {
                                 sum[i] += resultado[j];
                             }
                        }
                    }
                    indice = indexOfMax(sum);

                 }
                 i = indice;
                 j = this.pecas_array[i].length-sum[i];

                 return i+" "+j;
            }
            this.user_play(play);
        }
        else{
            while(true){
                var i = Math.floor((Math.random() * tamanho));
                if (this.pecas_array[i].length != 0){
                    break;
                }
            }

            while(true){
                var j = Math.floor((Math.random() * tamanho));
                if (this.pecas_array[i][j]!= null){
                    break;
                }
            }

            this.user_play(i+" "+j);
        }
    }

}

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


function display_game() {
  close_panels();
  document.getElementById('tabuleiro_div').style.display = 'table';
}

function init_game(){
  document.getElementById('game_start').style.display = 'none';
  document.getElementById('game_continue').style.display = 'inline';
  current_tabuleiro = Object.create(Tabuleiro);
}


function move(clicked_id){
    current_tabuleiro.user_play(clicked_id);
    current_tabuleiro.machine_play(clicked_id);
}
