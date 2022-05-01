import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("http://localhost:3000");
console.log("all");

socket.on('ping', ()=>{
    socket.emit('pong','allPing');
    console.log('sent')
})