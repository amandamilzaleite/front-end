function autenticar(){
    // recupero os valore digitados nos campos de INPUT
    var txtEmail = document.getElementById("txtEmail").value;
    var txtSenha = document.getElementById("txtSenha").value;
    // vou exibi-los no console
    console.log("Digitou = "+txtEmail+" / "+txtSenha);

    // definir alguns passos

    // essa é a mensagem do corpo
    var msgBody = {
        email : txtEmail,
        senha : txtSenha
    }
    console.log(msgBody)
    // preciso, agora, definir o formato da mensagem de cabeçalho
    // 1 - definir o método como POST
    // 2 - definir a mensagem como corpo da requisição (só que convertido para STRING)
    // 3 - definir que a string é do tipo Application/JSON
    var cabecalho = {
        method : "POST", 
        body   : JSON.stringify(msgBody),  // preciso converter o objeto da msgBody para uma STRING JSON
        headers : {
            "Content-type":"application/json"
        }
    }

    // agora sim posso enviar os dados
    // então funciona assim: lançamos a solicitação FETCH para o backEnd
    // como não é algo síncrono, temos que esperar pelo resultado. Assim que vier o resultado, 
    // armazenamos numa variável chamada RES. E, chegando esse RES, chamamos a função trataResposta
    // passando o RES como parâmetro
    fetch("http://localhost:8088/login", cabecalho)
       .then(res => trataResposta(res));
        

}


function trataResposta(res){
    if (res.status == 200){
        //document.getElementById("msgERRO").innerHTML = "<h3>Conectado com Sucesso!<h3>";
        // do resultado positivo (ou seja, o usuário existe), vou extrair o corpo da mensagem
        // que veio como JSON e chamar a função LOGAR passando esse objeto JSON
        res.json().then(objeto => logar(objeto));
    }
    else if (res.status == 401){
        document.getElementById("msgERRO").innerHTML = "<h3>Senha Inválida</h3>";
    }
    else if (res.status == 404){
        document.getElementById("msgERRO").innerHTML = "<h3>Usuário Desconhecido</h3>";
    }
}

function logar(objeto){
    // agora a idéia é armazenar o objeto do usuário recebido na resposta dentro do
    // armazenamento interno do browser

    // em um sistema real eu não armazeno o objeto, mas um TOKEN

    var objSTR = JSON.stringify(objeto);           // converti o objeto pra uma string
    localStorage.setItem("ScheduleUSER",objSTR);   // armazenei no local storage
    window.location = "home.html";                 // vou pra página principal
}