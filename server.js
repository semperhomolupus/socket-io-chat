const express = require('express');
const http = require('http');
const socket = require('socket.io');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = socket.listen(server);
let messages = [];
let users = [];
server.listen(port);


app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + './index.html')
    console.log('started') 
})


io.sockets.on('connection', (socket) => {
    console.log('Socket connected', socket);
    const userID = socket.handshake.query.userID;
    
    if (+userID) {
        console.log(userID, 'userID')
        socket.emit('send_all_messages', messages);
    } else {
        socket.emit('show_login_button');
    }

    socket.on('send_message', (data) => {
        console.log('send_message')
        messages.push(data)
        io.sockets.emit('add_message', data);
    })
})