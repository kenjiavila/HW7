var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
console.log("websockets server started");

ws.on("connection", function (socket){
  console.log("client connection established");
  messages.forEach(function (msg){
    socket.send(msg);
  });

// Echo server
  socket.on("message", function(data){
    console.log("message received: " + data);
    if (data.substring(0,6) === "/topic"){
      ws.clients.forEach(function (clientSockets) {
        clientSockets.send("*** Topic is \'Chatting about WebSockets\'");
      });
    } else{
      messages.push(data);
      // socket.send(data);
      ws.clients.forEach(function (clientSockets) {
      clientSockets.send(data);
    });
  }
  });
});
