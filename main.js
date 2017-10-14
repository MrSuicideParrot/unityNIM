
/* VAriavies globais */
var tamanho = 4;



function login() {
    user = "Admin";
    document.getElementById('registo').style.display = "none";
    document.getElementById('login_form').style.display = "none";
    document.getElementById('barra_lateral').style.display = "inline";
    document.getElementById('login_').innerHTML += ('Welcome, '+user+"!");
    document.getElementById('right_side').style.display = "inherit";
    document.getElementById('tabuleiro_div').style.display = 'table';
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

      for (var j = 0; j < length_next; j++) {
        var elemento = document.createElement("td");
        elemento.setAttribute("class", "peca_jogo");
        elemento.textContent="Life";
        linha.appendChild(elemento);
      }

      parent_element.appendChild(linha);
  }


}
