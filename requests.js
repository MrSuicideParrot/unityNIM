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
        changeToLoged(login);
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
