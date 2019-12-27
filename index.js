const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const users = [];


io.on('connection', function (socket) {
    socket.on('send-nickname', (name) => { 
        if (users.includes(name)) {
            socket.emit("name-available", { available: true });
        } else { 
            socket.nickname = name;
            users.push(socket.nickname);
            console.log(users);
        }
    })

    socket.on("typing message", (isTyping) => { 
        console.log(isTyping);
        socket.broadcast.emit("typing message", { name: socket.nickname , isTyping });
    })

    socket.on("no longer typing", (isTyping) => { 
        console.log(isTyping);
        socket.broadcast.emit("no longer typing", { name: socket.nickname, isTyping: !isTyping });
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
