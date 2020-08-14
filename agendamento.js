var listaDeAgencias;
var pos=0;

function carregaAgencias(){

    fetch("http://localhost:8088/agencias")
       .then(res => res.json())
       .then(lista => preencheAgencias(lista));
}

function preencheAgencias(lista){
    listaDeAgencias = lista;


    var templateSelect = "<select class='form-control' id='txtAgencia' onchange='montaHorarios()'> {{OPCOES}} </select>";
    var templateOption = "<option value='{{VALOR}}'> {{NOME}}  </option>";

    var opcoes = "";
    for (i=0; i<listaDeAgencias.length;i++){
        var ag = listaDeAgencias[i];
        opcoes += templateOption.replace("{{VALOR}}",ag.id)
                                .replace("{{NOME}}",ag.nome);
    }
    var novoSelect = templateSelect.replace("{{OPCOES}}",opcoes);
    document.getElementById("optionAgencia").innerHTML = novoSelect;
    montaHorarios();
}

function montaHorarios(){
    pos = document.getElementById("txtAgencia").selectedIndex;
    var horarioSelect=`<select class="form-control" id="txtHoraInicio" onchange="mudaTermino()"> {{OPCOES}} </select>`;
    var horaOption   =`<option value="{{VALORHORA}}"> {{HORA}} </option>`;
    var agAtual = listaDeAgencias[pos];
    var opcoesHoras="";
    for (hora=agAtual.horaInicio; hora < agAtual.horaFim ; hora++){
        var strHora = hora+":00";
        opcoesHoras = opcoesHoras+horaOption.replace("{{VALORHORA}}",strHora)
                                            .replace("{{HORA}}", strHora);
        strHora = hora+":30";
        opcoesHoras = opcoesHoras+horaOption.replace("{{VALORHORA}}",strHora)
                                            .replace("{{HORA}}", strHora);
    }
    var novoSelect = horarioSelect.replace("{{OPCOES}}", opcoesHoras);
    document.getElementById("horaInicio").innerHTML = novoSelect;
}

function mudaTermino(){
    var horaInicio = document.getElementById("txtHoraInicio").value;
    var hora = horaInicio.substr(0,2);
    var minuto = horaInicio.substr(3,2);

    var minutoFim;
    var horaFim = hora;
    if (minuto == '00'){
        minutoFim = ':30';
    }
    else{
        horaFim = parseInt(hora)+1;
        minutoFim = ':00';
    }
    document.getElementById("txtHoraFim").value = horaFim+minutoFim;
}

function enviarDados(){
    var txtNome    = document.getElementById("txtNome").value;
    var txtEmail   = document.getElementById("txtEmail").value;
    var txtCelular = document.getElementById("txtCelular").value;
    var txtData    = document.getElementById("txtData").value; 
    var txtNovaData = txtData.substr(8,2)+"/"+txtData.substr(5,2)+"/"+txtData.substr(0,4);
    var txtHora    = document.getElementById("txtHoraInicio").value; 
    var txtObs     = document.getElementById("txtObs").value;
    var txtAG      = listaDeAgencias[pos].id;
    
    var msgBody = {
        nomeCliente : txtNome,
        emailCliente: txtEmail,
        celularCliente : txtCelular,
        dataAgendamento : txtNovaData,
        horaAgendamento : txtHora,
        observacao : txtObs,
        agencia :{
             id: txtAG
        }
    };

    console.log(msgBody);

    var cabecalho = {
        method : "POST",
        body : JSON.stringify(msgBody),
        headers : {
            "Content-type":"application/json"
        }
    }

    fetch("http://localhost:8088/agendamentos/novo", cabecalho)
       .then(res => trataResultado(res));
}

function trataResultado(res){
    if (res.status == 201){
        res.json().then(agendamento => geraProtocolo(agendamento));
    }
    else{
        alert("Problemas ao enviar sua solicitacao - Entre em contato com SAC");
    }
}

function geraProtocolo(agendamento){
    alert("Agendamento Concluido. Numero do Protocolo "+agendamento.id);

}