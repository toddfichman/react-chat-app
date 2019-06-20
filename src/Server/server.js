var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let allClients = [];

io.on('connection', function(socket){
  console.log('a user connected');
  allClients.push(socket.id);
  console.log(allClients);
  socket.on('connection', function() {
    io.emit('connection', allClients)
  })
  socket.on('connection message', function({user, users}) {
    console.log('New User Connected', user, users);
    io.emit('connection message', {user, users})
  })
  socket.on('chat message', function(msg){
    console.log('socket.on in server', msg);
    console.log('io.emit in server');
    io.emit('chat message', msg)
  });

  socket.on('disconnect', function() {
    var i = allClients.indexOf(socket.id);
    console.log('Got disconnect!', i);
    allClients.splice(i, 1);
    io.emit('disconnect')
 });
});


http.listen(3001, function(){
  console.log('listening on *:3001');
});