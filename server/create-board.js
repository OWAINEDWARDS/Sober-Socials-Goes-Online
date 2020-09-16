const createBoard = (size) => {

  let board;

  const clear = () => {
    board = Array(size).fill().map(() => Array(size).fill(null));
  };

  const getBoard = () => board;

  const makeTurn = (x, y, colour) => {
    board[y][x] = colour;
  };

  clear(); // init board with null values. 

  return{
    clear, getBoard, makeTurn
  };
};

module.exports = createBoard;
