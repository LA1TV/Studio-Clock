const express = require('express');
const socket = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const server = app.listen(port, () => {
    console.log(`pi-clock is istening on port ${port}`);
});

const io = socket.listen(server);
io.sockets.on('connection', socket => {
    console.log(`web socket opened`);
});