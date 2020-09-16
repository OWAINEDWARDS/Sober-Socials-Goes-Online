console.log('Server will be here');

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomColour = require('randomcolor');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`)

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (sock) => {
  console.log('someone connected');
  sock.emit('message', 'Hi,Im the server and you are Connected');

  const colour = randomColour(); // new colour on connection.

  sock.on('message', (text) => io.emit('message', text));//io.emit sends it too all but sock.emit only to 1 client
  sock.on('turn', ({ x, y }) => io.emit('turn', { x, y, colour }));

});

server.on('error', (err) => {
  console.error('Server ERRROR:', err);
});

server.listen(8081, () => {
  console.log('RPS started on 8081');
});
