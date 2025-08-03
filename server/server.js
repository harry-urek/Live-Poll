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
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://live-poll-gxy5.vercel.app',
        'https://*.vercel.app',
        '*'
    ];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    allowEIO3: true, // Enable Engine.IO v3 compatibility if needed
    transports: ['websocket', 'polling']
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin matches any allowed origin (including wildcard patterns)
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin === '*') return true;
            if (allowedOrigin.includes('*')) {
                const pattern = allowedOrigin.replace('*', '.*');
                const regex = new RegExp(pattern);
                return regex.test(origin);
            }
            return allowedOrigin === origin;
        });

        if (!isAllowed) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add preflight handling
app.options('*', cors());

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
