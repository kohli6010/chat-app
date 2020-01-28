const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let users = [];

io.on('connection', function(socket) {
    socket.on('send-nickname', (name) => {
        if (users.includes(name)) {
            socket.emit('name-available', { available: true });
        } else {
            socket.nickname = name;
            users.push(socket.nickname);
            console.log(users);
        }
    });

    socket.on('typing message', (isTyping) => {
        socket.broadcast.emit('typing message', { name: socket.nickname, isTyping });
    });

    socket.on('no longer typing', (isTyping) => {
        socket.broadcast.emit('no longer typing', { name: socket.nickname, isTyping: !isTyping });
    });

    console.log('a user connected');
    socket.on('disconnect', function() {
        users = users.filter((name) => {
            if (name == socket.nickname) return false;
            else return true;
        });
        console.log(users);
        io.emit('disconnection message', { msg: `${socket.nickname} just got disconnect` });
        console.log('user disconnected');
    });

    socket.on('chat message', function(chat) {
        const obj = {
            name: socket.nickname,
            chat,
        };
        socket.broadcast.emit('chat message', obj);
    });
});

http.listen(port, () => console.log(`Request recieved`));
