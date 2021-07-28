const express = require('express');
const {v4: uuidv4} = require('uuid');
const app= express();
const server= require('http').Server(app);

// socket.io setup
const io= require('socket.io')(server);

//Peer server setup
const {ExpressPeerServer} = require('peer');
const peerServer= ExpressPeerServer(server, {
    debug: true
});


app.use(express.static('public'));
app.set('view engine','ejs');

app.use('/peerjs', peerServer);

app.get('/', (req, res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res)=>{
    res.render('room', {roomId : req.params.room });
})

io.on('connect', socket=>{
    
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('message', (message)=>{
            io.to(roomId).emit('createMessage', message);
        })
        
    })
})

server.listen(process.env.PORT || 3030);