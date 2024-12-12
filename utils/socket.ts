import io, { Socket  } from 'socket.io-client';

const socketServerUrl = process.env.EXPO_PUBLIC_WS_URL as string

export const socket = io(socketServerUrl).connect();

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
