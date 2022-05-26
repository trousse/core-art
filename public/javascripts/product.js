import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("https://core-art-sorbonne.fr/");

socket.on('ping', ()=>{
    socket.emit('pong','productNav');
})