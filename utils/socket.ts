import io, { Socket  } from 'socket.io-client';


const socket = io('http://your-socket-server-url');

socket.on('message', (message: string) => {
    console.log('New message received:', message);
});


function initializeSocket(url: string) {
    return io(url);
}

function closeSocket(socket: SocketIOClient.Socket) {
    socket.close();
}

function sendMessage(socket: SocketIOClient.Socket, message: string) {
    socket.emit('message', { text: message });
}

export { initializeSocket, closeSocket, sendMessage };
