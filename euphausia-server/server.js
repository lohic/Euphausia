var tcp_PORT = 18000;
var tcp_HOST = "192.168.1.100";


/*********/
/* HTML **/
/*********/
var allClients = 0; 
var clientId = 1;
var express = require('express');
var html = require('express')()
  , server = require('http').createServer(html)
  , io = require('socket.io').listen(server); 

server.listen(8333);

html.use(express.static(__dirname + '/public'));
var req = html.get('/', function (req, res) {});
req.on('error', function (e) {
    console.log(e);
});
req.on("socket", function (socket) {
  socket.emit("agentRemove");
});

io.set('log level', 2);

tcpSocket = require('net');


io.sockets.on('connection', function (socket) {
    var my_client = { 
        "id": clientId, 
        "obj": socket 
    };
    clientId += 1; 

    socket.emit("agentRemove");

    ///
    ///http://stackoverflow.com/questions/11967958/create-websockets-between-a-tcp-server-and-http-server-in-node-js
    ///
    var tcpClient = new tcpSocket.Socket();
    tcpClient.setEncoding("utf8");
    tcpClient.setKeepAlive(true);

    tcpClient.connect(tcp_PORT, tcp_HOST, function() {
        console.info('HTTP CLIENT connected to :  tcp_HOST:' + tcp_PORT);

        // TEST
        tcpClient.on('data', function(data) {
            console.log('DATA: ' + data);
            socket.emit("httpServer", data);
        });

        tcpClient.on('end', function(data) {
            console.log('END DATA : ' + data);
        });

        tcpClient.on('error', function(e) {
            console.log(e);
        });

        tcpClient.on("socket", function (socket) {
          socket.emit("agentRemove");
        });
        // END TEST
    });
   

    // TEST
    socket.on('tcp-manager', function(message) {
        console.log('"tcp" : ' + message);
        return;
    });
    // END TEST

    socket.on('disconnect', function () {
        io.sockets.emit('user disconnected');
    });

    socket.on('message', function(data) {
        socket.send(
            JSON.stringify({
               validation :'ok'
            })
        );
        // on envoie le contenu au serveur TCP
        console.log("From http to flash socket : "+formateMessage(data));
        tcpClient.write(formateMessage(data)+"\0");
        
    });

    socket.on('error',function(e){
        console.log(e);
    });

});






//**************//
// FILTRAGE SMS //
//**************//
var actions = {
    0 : {"type":"color","code":"FF0000"},
    1 : {"type":"color","code":"00FF00"},
    2 : {"type":"color","code":"0000FF"},
    3 : {"type":"color","code":"FFFF00"},
    4 : {"type":"color","code":"FF00FF"},
    5 : {"type":"color","code":"00FFFF"},
    6 : {"type":"creature","code":"explode"},
    7 : {"type":"creature","code":"create"},
    8 : {"type":"creature","code":"cleaner"},
    9 : {"type":"creature","code":"die"}
};
var nbr_actions = 10;

function formateMessage(txt){
    var texte_array = txt.split(" ");
    var nbrMots     = texte_array.length;

    for (j=nbrMots-1;j>=0;j--){
        if(texte_array[j] == "" || texte_array[j] == "\n" || texte_array[j] == "\r" || texte_array[j]== undefined){
            texte_array.splice(j,1);
        }
    }

    nbrMots     = texte_array.length;
    idMotAction = Math.floor(Math.random()*nbrMots);

    idAction = Math.floor(Math.random()*nbr_actions);

    type = actions[idAction]["type"];
    code = actions[idAction]["code"];


    var retour      = '<phrase>';

    for(j=0;j<nbrMots;j++){
        if(j==idMotAction){
            retour = retour + '<mot texte="'+texte_array[j]+'" code="'+type+'" valeur="'+code+'" />';
        }else{
            retour = retour + '<mot texte="'+texte_array[j]+'" code="" valeur="" />'; 
        }
    }

    retour = retour + '</phrase>';

    return retour;
}