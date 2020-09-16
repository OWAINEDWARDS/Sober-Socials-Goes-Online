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

(() => {
  // add a new button which calls this. becaue this method runs upon page open
  const sock = io();
  sock.on('message', log);

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
})();
