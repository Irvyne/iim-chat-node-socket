require('colors');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const requestIp = require('request-ip');
const redis = require("redis");
const client = redis.createClient();

function consoleLog(event, method, msg = undefined) {
    console.log(event.red + '.' + method.yellow + (msg !== undefined ? (' => ' + msg) : ''));
}

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', function (socket) {
    consoleLog('socket', 'connection', 'another user connected');

    socket.on('chat.join', (username) => {
        consoleLog('chat', 'join', `${username} has IP ${requestIp.getClientIp(socket.request)}`);

        // 1. Save username
        socket.username = username;
        socket.userIp = requestIp.getClientIp(socket.request);

        // 2. Broadcast username
        socket.broadcast.emit('chat.join', username)
    });

    socket.on('chat.message', (message) => {
        consoleLog('chat', 'message', ('[' + socket.username + ']').bold + ' message: ' + message);
        // {bold}[Irvyne]{/bold} message ....
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, () => console.log('Listening on ' + 'http://localhost:3000\n'.green));