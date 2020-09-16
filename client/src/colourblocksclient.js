const log = (text) => {
  const parent = document.querySelector('#events');//' for id querySelector'
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight; // need css for height?
};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text);
};

const getBoard = (canvas) => {

  const ctx = canvas.getContext('2d');

  const fillRect = (x, y, colour) => {
    ctx.fillStyle = colour;
    ctx.fillRect(x-10, y-10, 20, 20);

  };

  return { fillRect }; //returning fillRect function

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
  const { fillRect } = getBoard(canvas);

  const sock = io();

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    fillRect(x, y, 'green');
  };

  fillRect(50, 50, 'green');

  sock.on('message', log);

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));

    canvas.addEventListener('click', onClick);
})();
