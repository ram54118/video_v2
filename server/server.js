const express = require('express');
const app = express();
const http = require('http');
const https = require('https')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
var server;
let broadcaster;

const port = parseInt(process.env.port) || 3080;

if (process.env.SSL == "true") {
  var ssloptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl/ryans-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl/ryans-cert.pem')),
    //    ca: fs.readFileSync(path.join(__dirname, resolveURL('keys/domain-ca.pem')))
  };
  server = https.createServer(ssloptions,app);
} else {
  server = http.createServer(app);
}
const io = require('socket.io')(server);
// app.use(express.static(__dirname + '/public'));
app.use(express.static(process.cwd() + '/dist/capture/'));

io.sockets.on('error', (e) => console.log(e));
io.sockets.on('connection', (socket) => {
  console.log('connected');
  socket.on('broadcaster', () => {
    console.log("br")
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', () => {
    if(broadcaster != socket.id){
      socket.to(broadcaster).emit('watcher', socket.id);
    }
  });
  socket.on('offer', (id, message) => {
    socket.to(id).emit('offer', socket.id, message);
  });
  socket.on('answer', (id, message) => {
    socket.to(id).emit('answer', socket.id, message);
  });
  socket.on('candidate', (id, message) => {
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('stopStream', (id) => {
    socket.to(id).emit('stopStream');
  });
  socket.on('disconnect', () => {
    socket.to(broadcaster).emit('disconnectPeer', socket.id);
  });

  app.get('/', (req, res) => {
    console.log('called');
    res.sendFile(process.cwd() + '/dist/capture/index.html');
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
