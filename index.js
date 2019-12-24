const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', function (socket) {
    socket.on('send-nickname', (name) => { 
        socket.nickname = name;
        console.log(socket.nickname);
    })
    console.log('a user connected');
    socket.on('disconnect', function() {
        io.emit('disconnection message', { msg: `${socket.nickname  } just got disconnect` });
        console.log('user disconnected');
    });
    socket.on('chat message', function (chat) {
        const obj = {
            name: socket.nickname,
            chat
        }
        socket.broadcast.emit('chat message', obj);
    });
});

http.listen(3000, () => console.log(`Request recieved`));
