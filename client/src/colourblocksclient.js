const log = (text) => {
  const parent = document.querySelector('#events');//' for id querySelector'
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);

};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text);
};

const getBoard = (canvas, numCells = 20) => {

  const ctx = canvas.getContext('2d');
  const cellSize = Math.floor(canvas.width/numCells);

  const fillCell = (x, y, colour) => {
    ctx.fillStyle = colour;
    ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);

  };

  const drawGrid = () => {
    ctx.beginPath();

    for(let i =0; i < numCells + 1; i++){
      ctx.moveTo(i*cellSize, 0);
      ctx.lineTo(i*cellSize, cellSize*numCells);
      ctx.moveTo(0, i*cellSize);
      ctx.lineTo(cellSize*numCells, i*cellSize);
    }

    ctx.stroke();
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const reset = (board) => {
    clear();
    drawGrid();
    renderBoard(board);
  };

  const getCellCoords = (x, y) => {
    return {
      x: Math.floor(x/cellSize),
      y: Math.floor(y/cellSize)
    };
  };

  const renderBoard = (board = []) => { // empty array by default so if no board passed then this function does nothing.
    board.forEach((row, y) => {
      row.forEach((colour, x) => {
        colour && fillCell(x, y, colour); //color not null then fill
      });
    });
  };

  return { fillCell, reset, getCellCoords }; //returning fillRect function

};

const getClickCoordinates = (element, ev) => {
  const { top, left } = element.getBoundingClientRect();
  const { clientX, clientY } = ev; // where we clicked event passed to this function

  return {
    x: clientX - left,
    y: clientY - top
  };
};



(() => {

  const canvas = document.querySelector('canvas');
  const { fillCell, reset, getCellCoords } = getBoard(canvas);

  const sock = io();

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    sock.emit('turn', getCellCoords(x, y));

  };



  sock.on('board', reset);
  sock.on('message', log);
  sock.on('turn', ({ x, y, colour }) => fillCell(x, y, colour));

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));

    canvas.addEventListener('click', onClick);
})();
