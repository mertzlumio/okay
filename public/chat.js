if (!window.socket) {
  window.socket = io();
}
window.socket.on('player id', (id) => {
    playerId = (id) / 2;
    console.log('Assigned player ID in Chat:', playerId);
  });


const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value, playerId);
        input.value = '';
    }
});

socket.on('chat message', (msg, playerId) => {
    console.log(playerId);
    const item = document.createElement('li');
    item.textContent = `Player ${playerId}: ${msg}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
