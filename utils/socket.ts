import io from 'socket.io-client';

const SocketServerUrl = process.env.EXPO_PUBLIC_WS_URL as string



export const socket = io( "wss://txbq7qkk-6900.use2.devtunnels.ms", {
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

export const joinChat = (chat_id: string) => {
    socket.send('join', chat_id)
}

export const joinNotificationsRoom = (user_id: string) => {
    socket.send('join-self', user_id)
}
