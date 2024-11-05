const socket = new WebSocket('ws://localhost:5000');

socket.addEventListener('open', (event) => {
    console.log('Connection established with the WebSocket server');
});

//socket.onmessage = (event) => { };
socket.addEventListener('message', (event) => {
    event.data.arrayBuffer().then((data) => {
        const message = new TextDecoder('utf-8').decode(data);
        console.log(message);
        document.querySelector('#messages').insertAdjacentHTML('beforeend', message);
    });
});

document.querySelector('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.querySelector('#input').value;
    let username = document.querySelector('#username').value;
    const displayName = username.trim() === '' ? 'Anonymous' : username;
    const item = `<p>${message}</p><small class="extra-small">enviado por ${displayName}</small>`;
    const item2 = `<p class="right-align">${message}</p><small class="right-align-block extra-small">enviado por ${displayName}</small>`;
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(item2);
        console.log(message);
    }
    document.querySelector('#messages').insertAdjacentHTML('beforeend', item);
    document.querySelector('#input').value = '';
    document.querySelector('#input').focus();
});
