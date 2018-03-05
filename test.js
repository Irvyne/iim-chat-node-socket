const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const requestIp = require('request-ip');
const redis = require("redis");
const client = redis.createClient();

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', function(socket){

    socket.on('chat.join', (username) => {
        console.log(`${username} has IP ${requestIp.getClientIp(socket.request)}`);
        // 1. Save username
        // 2. Broadcast username
        socket.broadcast.emit('chat.join', username)
    });

    socket.on('chat.message', (message) => {

    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
http.listen(3000, () => console.log('Example app listening on port 3000!'));