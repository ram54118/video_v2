const express = require('express');
const app = express();

let broadcaster;
const port = 3080;

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);
// app.use(express.static(__dirname + '/public'));
app.use(express.static(process.cwd() + '/dist/capture/'));

io.sockets.on('error', (e) => console.log(e));
io.sockets.on('connection', (socket) => {
  console.log('connected');
  socket.on('broadcaster', () => {
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', () => {
    socket.to(broadcaster).emit('watcher', socket.id);
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
