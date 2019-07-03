const express = require('express');
const http = require('http');
const socket = require('socket.io');


const app = express();
const server = http.createServer(app);
server.listen(3000);
const io = socket.listen(server);

console.log('socket')
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
    console.log('started') 
})


let messages = [];
//let connections = [];


io.sockets.on('connection', (socket) => {
    console.log('Socket connected');

    socket.emit('send_all_messages', messages);
    //connections.push(socket);

    // socket.on('disconnect', () => {
    //     connections.splice(connections.indexOf(socket), 1);
    //     console.log('Socket disconnected');
    // })

    socket.on('send_message', (data) => {

        console.log('send_message')

        
        console.log(data, 'data')
        messages.push(data)
        console.log(messages, 'messages')
        io.sockets.emit('add_message', data);
    })
})