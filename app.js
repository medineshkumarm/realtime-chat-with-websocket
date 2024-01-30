const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require('uuid').v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const PORT = process.env.PORT || 8000;

const connections = {};
const users = {};

const broadcast = (message) => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        connection.send(message, (error) => {
            if (error) {
                console.error(`Error broadcasting message to ${uuid}: ${error.message}`);
            }
        });
        console.log(message);
    });
}

const handleMessage = (bytes, uuid) => {
    try {
        const message = JSON.parse(bytes.toString());
        const user = users[uuid];

        if (message.type === 'text') {
            const { content } = message;
            const formattedMessage = {
                type: 'text',
                content,
                sender: user.username,
            };

            broadcast(JSON.stringify(formattedMessage));
        }

        // Other message types can be handled here

        console.log(`${user.username} sent a message: ${JSON.stringify(message)}`);
    } catch (error) {
        console.error(`Error parsing message from ${uuid}: ${error.message}`);
    }
}

const handleClose = (uuid) => {
    const disconnectedUser = users[uuid];

    if (disconnectedUser) {
        console.log(`${disconnectedUser.username} disconnected`);

        delete connections[uuid];
        delete users[uuid];

        broadcast(JSON.stringify({ type: 'userLeft', username: disconnectedUser.username }));
    } else {
        console.error(`Unknown user with UUID ${uuid} disconnected`);
    }
};

wsServer.on("connection", (connection, request) => {
    const { username } = url.parse(request.url, true).query;
    const uuid = uuidv4();

    connections[uuid] = connection;
    users[uuid] = {
        username,
        state: {}
    };

    broadcast(JSON.stringify({ type: 'userJoined', username }));

    console.log(`New connection with username: ${username}`);
    connection.on("message", message => handleMessage(message, uuid));
    connection.on("close", () => handleClose(uuid));
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('Shutting down the server...');
    wsServer.close(() => {
        console.log('WebSocket server closed.');
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
