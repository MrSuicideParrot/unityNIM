var serverApi = "http://twserver.alunos.dcc.fc.up.pt:8008";

function registerApi(login, password) {
  content ={
    "name":login,
    "pass":password,
  };

  post_content = JSON.stringify(content);

   if(!XMLHttpRequest) {
     console.log("XHR não é suportado");
     return;
   }

   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function() {
        if(xhr.readyState== 4 && xhr.status == 200){
          console.log("entre");
            res  = JSON.parse(xhr.responseText);
            if(isEmpty(res)){
              changeToLoged(login);
            }
            else{
              console.log(res["error"]);
              alert(res["error"]);
            }
        }
    }

   xhr.open("POST",serverApi+"/register", true);
   xhr.send(post_content);
}
