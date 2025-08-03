const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const registerPollSocket = require('./pollSocket');

const app = express();
const server = http.createServer(app);

// Updated CORS configuration for Vercel deployment
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', '*'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    },
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1 && allowedOrigins.indexOf('*') === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Live Polling Server Running');
});


io.on('connection', (socket) => {
    console.log(`🧠 Socket connected: ${socket.id}`);
    registerPollSocket(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
