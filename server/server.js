console.log('Server will be here');

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomColour = require('randomcolor');
const createBoard = require('./create-board');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`)
app.use(express.static(clientPath));
const server = http.createServer(app);
const io = socketio(server);
// making board to keep game state
const { clear, getBoard, makeTurn } = createBoard(20);

io.on('connection', (sock) => {
  console.log('someone connected');
  sock.emit('board', getBoard());

  const colour = randomColour(); // new colour on connection.

  sock.on('message', (text) => io.emit('message', text));//io.emit sends it too all but sock.emit only to 1 client
  sock.on('turn', ({ x, y }) => {
    makeTurn(x, y, colour);
    io.emit('turn', { x, y, colour })
  });

});

server.on('error', (err) => {
  console.error('Server ERRROR:', err);
});

server.listen(8081, () => {
  console.log('RPS started on 8081');
});
