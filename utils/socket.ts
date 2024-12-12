import io, { Socket  } from 'socket.io-client';

const SocketServerUrl = process.env.EXPO_PUBLIC_WS_URL as string

export const socket = io(SocketServerUrl);

export const joinChat = (chat_id: string) => {
    socket.send('join', chat_id)
}

export const joinNotificationsRoom = (user_id: string) => {
    socket.send('join-self', user_id)
}
