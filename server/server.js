console.log('Server will be here');

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomColour = require('randomcolor');
const createBoard = require('./create-board');
const createCooldown = require('./createCooldown');

const app = express();

app.get('/', function(req, res){
  res.sendFile('index.html', {root: '../client'});
});

app.get('/games', function(req, res){
res.sendFile('games.html', {root: '../client'});
});

app.get('/colourblocks', function(req, res){
res.sendFile('colourblocks.html', {root: '../client'});
});



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
  const cooldownFinished = createCooldown(2000); // 2 seconds
  sock.on('message', (text) => io.emit('message', text));//io.emit sends it too all but sock.emit only to 1 client
  sock.on('turn', ({ x, y }) => {
    if(cooldownFinished()){

      const playerWon = makeTurn(x, y, colour);
      io.emit('turn', { x, y, colour });

      if(playerWon){
        sock.emit('message', 'You won!');
        io.emit('message', 'New Round');
        io.emit('board'); // client will know baord is empty becuase no board is passed with it.
        clear();
      }
    }

  });

});

server.on('error', (err) => {
  console.error('Server ERRROR:', err);
});

server.listen(8081, () => {
  console.log('RPS started on 8081');
});
