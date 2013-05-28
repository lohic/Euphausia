var tcp_PORT = 9001;

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
        console.info('HTTP CLIENT conected to :  localhost:' + tcp_PORT);

        /*tcpClient.on('data', function(data) {
            console.log('DATA: ' + data);
            socket.emit("httpServer", data);
        });*/

        /*tcpClient.on('end', function(data) {
            console.log('END DATA : ' + data);
        });*/
    });
    
    /*socket.on('tcp-manager', function(message) {
        console.log('"tcp" : ' + message);
        return;
    });*/

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
        console.log("From http to flash socket : "+data);
        tcpClient.write(data+"\0");
    });
});