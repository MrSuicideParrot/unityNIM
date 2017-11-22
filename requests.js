var serverApi = "http://twserver.alunos.dcc.fc.up.pt:8008";

function registerApi(login, password) {
  content ={
    "nick":login,
    "pass":password,
  };

  post_content = JSON.stringify(content);

  if(!XMLHttpRequest) {
    console.log("XHR não é suportado");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST",serverApi+"/register", true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4){
      return;
    }
    res  = JSON.parse(xhr.responseText);
    if(xhr.status == 200){
      if(isEmpty(res)){
          user = login;
          pass_ = password;
        changeToLoged();
      }
      else{
        console.log(res["error"]);
        alert(res["error"]);
      }
    }
    else{
      alert(res["error"]);
    }
  }

  xhr.send(post_content);
}


function rankingAPI(){
  content ={
    "size":tamanho,
  }
  post_content = JSON.stringify(content);
  if(!XMLHttpRequest) {
    console.log("XHR não é suportado");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST",serverApi+"/ranking", true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4){
      return;
    }
    res  = JSON.parse(xhr.responseText);
    if(xhr.status == 200){
      if(res["error"]){
        console.log(res["error"]);
        alert(res["error"]);
      }
      else{
        var auxarray = {};
        for(var i in res["ranking"]){
          auxarray[i] = [res["ranking"][i]["nick"], res["ranking"][i]["victories"], res["ranking"][i]["games"],]
        }
        beautiful_API = auxarray;
        open_scores();
      }
    }
    else{
      alert(res["error"]);
    }
  }

  xhr.send(post_content);
}


function joinAPI(){
    content ={
        'group':group,
        'nick':user,
        'pass':pass_,
        'size':tamanho,
    };

    post_content = JSON.stringify(content);

    if(!XMLHttpRequest) {
      console.log("XHR não é suportado");
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST",serverApi+"/join", true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState < 4){
        return;
      }
      res  = JSON.parse(xhr.responseText);
      if(xhr.status == 200){
        current_tabuleiro.game_id = res["game"];
        updateAPI();
        current_tabuleiro.lock = 0;
      }
      else{
        alert(res["error"]);
      }
    }
     xhr.send(post_content);
}

function updateAPI(){
    url = serverApi + "/update?game="+current_tabuleiro.game_id+"&nick="+user;
    Tabuleiro.prototype.eventSource = new EventSource(encodeURI(url));
    ss.onmessage = function(event) {
        var data = JSON.parse(event.data);
        //to do
    };

}
