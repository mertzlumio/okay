const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

let playerCount = 0;
let gamestart = 0;

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
   
    playerCount += 1;

    if(playerCount%2==0)
    {    
        console.log('Player '+playerCount/2+' Connected');
    }

    socket.emit('player id',playerCount);

    socket.on('update ball1', (bat1data) => {
        //console.log(bat1data.angle);
        io.emit('ball1', (bat1data));        
    });

    socket.on('update ball2', (bat2data) => {
       //console.log(bat2data); 
        io.emit('ball2', (bat2data));
    });

    socket.on('chat message', (msg, playerId) =>{
        io.emit('chat message', msg, playerId);
        if(gamestart<2){
            if(msg === 'ready'){
                gamestart+=1;
            }
        }   
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected');
    });
});

server.listen(3500, () => {
    console.log('Listening on port 3500');
});
