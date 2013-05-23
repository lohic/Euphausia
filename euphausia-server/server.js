var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')


/*var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);*/

io.set('log level', 3);
app.listen(8333);
//app.listen(80);//
//
console.log("SERVER LISTENING ON PORT 8333");


function handler (req, res) {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

/*
app.get('/', function (req, res) { 
    res.sendfile(__dirname + '/index.html'); 
}); 
*/

var allClients = 0; 
var clientId = 1; 

io.sockets.on('connection', function (client) { 
    var my_timer; 
    var my_client = { 
        "id": clientId, 
        "obj": client 
    }; 
    
    clientId += 1; 
    allClients += 1; 
    
    /*my_timer = setInterval(function () { 
        my_client.obj.send(JSON.stringify({ 
            "timestamp": (new Date()).getTime(), 
            "clients": allClients 
        })); 
    }, 1000); 
    */
    client.on('message', function(data) {
        if(data=='Poke'){
            my_client.obj.broadcast.send(JSON.stringify({ 
                poke: "poke send by client " + my_client.id 
            }));
        }else{
            my_client.obj.broadcast.send(JSON.stringify({ 
                message: "message sms sent by client " + my_client.id,
                data: data
            }));

        }
        console.log(data); 
    });
    
    client.on('disconnect', function() { 
        clearTimeout(my_timer); 
        allClients -= 1; 
        console.log('disconnect'); 
    });

});