const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
});

const userSocketMap= {};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return{
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.io);

    socket.on(JOIN, ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(CODE_CHANGE, { code });
    });

    socket.on(SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
        socket.in(roomId).emit(DISCONNECTED, {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
    });
    delete userSocketMap[socket.id];
    socket.leave();
    });
});

const PORT = process.env.PORT || 1000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));