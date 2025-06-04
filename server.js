const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

let players = {};

io.on('connection', socket => {
  console.log('a user connected');

  // assign player id
  let playerId;
  if (!players.p1) {
    playerId = 'p1';
  } else if (!players.p2) {
    playerId = 'p2';
  } else {
    playerId = 'spectator';
  }
  players[playerId] = socket.id;
  socket.emit('playerType', playerId);

  socket.on('state', state => {
    socket.broadcast.emit('state', { id: playerId, state });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (players[playerId] === socket.id) {
      delete players[playerId];
    }
    io.emit('playerDisconnected', playerId);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
