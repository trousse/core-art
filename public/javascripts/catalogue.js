import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

socket.on('ping', ()=>{
    socket.emit('pong','catalogueNav');
    console.log('sent')
})