var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('connection message', function(user) {
    console.log('New User Connected', user);
    io.emit('connection message', user)
  })
  socket.on('chat message', function(msg){
    console.log('socket.on in server', msg);
    console.log('io.emit in server');
    io.emit('chat message', msg)
  });
});


http.listen(3001, function(){
  console.log('listening on *:3001');
});