var tcp_PORT = 18000;

/*********/
/* FLASH */
/*********/
var net = require('net');
var flashSocket;

var flashServer = net.createServer(function(socket) {
    flashSocket = socket;
    flashSocket.on("connect", onFlashConnect);
    flashSocket.on("data", onFlashData);
});

function onFlashConnect()
{
    console.log("Connected to Flash");
}

// When flash sends us data, this method will handle it
function onFlashData(d)
{ 
    if(d == 'flash data'){
        console.log(d);
    }else{
        console.log("From Flash to Flash= " + d);
        flashSocket.write(d, 'utf8');        
    }
}

// listen for connections
flashServer.listen(tcp_PORT);



/*********/
/* HTML **/
/*********/
var allClients = 0; 
var clientId = 1;
var express = require('express');
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server); 

server.listen(8333);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {});

io.set('log level', 2);


tcpSocket = require('net');


io.sockets.on('connection', function (socket) {
    var my_client = { 
        "id": clientId, 
        "obj": socket 
    };
    clientId += 1; 

    ///
    ///http://stackoverflow.com/questions/11967958/create-websockets-between-a-tcp-server-and-http-server-in-node-js
    ///
    var tcpClient = new tcpSocket.Socket();
    tcpClient.setEncoding("utf8");
    tcpClient.setKeepAlive(true);

    tcpClient.connect(tcp_PORT, function() {
        console.info('HTTP CLIENT connected to :  localhost:' + tcp_PORT);

    });   

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
});

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