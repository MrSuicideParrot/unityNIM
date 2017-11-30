var offsto = {};
var sto_flag = true;

function checkwebs(){
  if(typeof(Storage) === "undefined"){
    sto_flag = false;
  }
  else{
    load_storage();
  }
}

function load_storage(){
  if(sto_flag){
    if (localStorage.getItem("webs") != null) {
      offsto = JSON.parse(localStorage.getItem("webs"));
    }
  }
}

function save_storage(){
  if(sto_flag){
    localStorage.setItem("webs",JSON.stringify(offsto));
  }
}

function offlost(){
  if(sto_flag){
    give(0,1);
    save_storage();
  }
}

function offwon(){
  if(sto_flag){
    give(1,1);
    save_storage();
  }
}

function give(win,game){
  if(sto_flag){
    for(var i in offsto){
      if(offsto[i][0]==user_){
        offsto[i][1]+=win;
        offsto[i][2]+=game;
        return;
      }
    }
    offsto[i+1] = [user_, win, game,];
  }
}

function sort_scores(){
  if(sto_flag){
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
