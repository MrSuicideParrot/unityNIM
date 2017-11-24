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
          user_ = login;
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
        'nick':user_,
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
        current_tabuleiro = new Tabuleiro();
        current_tabuleiro.game_id = res["game"];
        verbose_msg(-1,"Waiting for other player...");
        updateAPI();
        current_tabuleiro.lock = 0;
      }
      else{
        console.log(res["error"]);
        document.getElementById('game_continue').style.display = 'none';
        document.getElementById('game_restart').style.display = 'inline';
        verbose_msg(-1,res["error"]);
      }
    }
     xhr.send(post_content);
}

function updateAPI(){
    url = serverApi + "/update?game="+current_tabuleiro.game_id+"&nick="+user_;
    current_tabuleiro.eventSource = new EventSource(encodeURI(url));
    current_tabuleiro.eventSource.onmessage = function(event) {
        var data = JSON.parse(event.data);

        //Erro de comunicação
        if (data.hasOwnProperty("error")){
            console.log(data["error"]);
            ss.close();
            current_tabuleiro.give_up();
            change_msg(-3);
        }

        //turn
        if (data.hasOwnProperty("turn")){
            verbose_msg(1, data["turn"]);
        }

        //Atualização de tabuleiro
        if (data.hasOwnProperty("rack") && data.hasOwnProperty("stack") && data.hasOwnProperty("pieces")) {
            current_tabuleiro.moveConverter(data["rack"],data["stack"],data["pieces"]);
        }

        //Winner
        if (data.hasOwnProperty("winner")){
            if(data["winner"]===user_){
                change_msg(1);
                document.getElementById('game_continue').style.display = 'none';
                document.getElementById('game_restart').style.display = 'inline';
            }
            else{
                verbose_msg(0, data["winner"]);
                document.getElementById('game_continue').style.display = 'none';
                document.getElementById('game_restart').style.display = 'inline';
            }
            current_tabuleiro.eventSource.close();
        }
    };

}

function notifyAPI(stack, pieces){
    content ={
      "stack":stack,
      "pieces":pieces,
      "game":current_tabuleiro.game_id,
      "nick":user_,
      "pass":pass_,
    };

    post_content = JSON.stringify(content);

    if(!XMLHttpRequest) {
      console.log("XHR não é suportado");
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST",serverApi+"/notify", true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState < 4){
        return;
      }
      res  = JSON.parse(xhr.responseText);
      if(xhr.status == 200){
        if(isEmpty(res)){

        }
        else{
          console.log(res["error"]);
          alert(res["error"]);
        }
      }
      else{
        verbose_msg(-1,res["error"]);
      }
    }

    xhr.send(post_content);
}

function leaveAPI(){
  content ={
      'game':current_tabuleiro.game_id,
      'nick':user_,
      'pass':pass_,
  };

  post_content = JSON.stringify(content);

  if(!XMLHttpRequest) {
    console.log("XHR não é suportado");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST",serverApi+"/leave", true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4){
      return;
    }
    res  = JSON.parse(xhr.responseText);
    if(xhr.status != 200){
      console.log(res["error"]);
      document.getElementById('game_continue').style.display = 'none';
      document.getElementById('game_restart').style.display = 'inline';
      verbose_msg(-1,res["error"]);
    }
  }
   xhr.send(post_content);
}
