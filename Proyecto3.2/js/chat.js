const socket = io('https://cinexunidos-production.up.railway.app');

const onlineUsersDiv = document.getElementById('online-users');
const messageListDiv = document.getElementById('message-list');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Evento 'connect'
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

// Evento 'disconnect'
socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

// Evento 'online-users'
socket.on('online-users', (data) => {
    onlineUsersDiv.textContent = `Usuarios en línea: ${data.count}`;
});

// Evento 'new-message'
socket.on('new-message', (data) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = `${data.user}: ${data.message}`;
    messageListDiv.appendChild(messageDiv);
    messageListDiv.scrollTop = messageListDiv.scrollHeight;
});

// Manejo del envío de mensajes
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value;
    socket.emit('send-message', { message });
    messageInput.value = '';
});
