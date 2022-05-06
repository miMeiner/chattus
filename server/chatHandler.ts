import { Server, Socket } from "socket.io";
import { getRooms } from "./roomStore";


export default (io: Server, socket: Socket) => {

    socket.on("join", (room) => {

        // Bestämmer om alla rum skall emitas till samtliga sockets
        const shouldBroadcastRooms: boolean = !getRooms(io).includes(room)

        socket.join(room)

        if (shouldBroadcastRooms) {
            io.emit("roomList", getRooms(io))
        }
        console.log(`${socket.data.nickname} joined ${room}`)
        socket.emit("joined", room)
    })

    socket.on("typing", (nickname) => {
        console.log(`${nickname} is typing`)
    })


    socket.on('leave', (room) => {
        console.log(`${socket.data.nickname} wants to leave ${room}`)
        socket.leave(room)
    })

    socket.on("message", (message, to) => {
        console.log(message) // här

        if (!socket.data.nickname) {
            return socket.emit("_error", "Missing nickname on socket..")
        }

        io.to(to).emit("message", message, { id: socket.id, nickname: socket.data.nickname })
    })

}