import io from 'socket.io-client';

const socketServerUrl = process.env.EXPO_PUBLIC_WS_URL as string



export const socket = io( socketServerUrl, {
  transports: ['websocket'], 
  reconnectionAttempts: 2, 
  reconnectionDelay: 10000,
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  socket.send('connected');
});

socket.on('connect_error', (error:any) => {
  console.log('Connection failed:', error);
});

export const joinChat = (chat_id: string, username: string) => {
    if (socket.disconnected) {
        console.log(socketServerUrl)
    }
    if (socket.disconnected) {
        console.log('Still not connected')
    }
    console.log(`joining room ${chat_id}`)
    socket.emit('join', chat_id, username,(response: string) => {
        console.log(response, 'from chat')
    })
}

export const joinNotificationsRoom = (user_id: string) => {
    // socket.emit('join-self', user_id, (response: string) => {
    //     console.log(response, 'from self')
    // })
}
