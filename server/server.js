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
        'https://live-poll-gxy5-hz7zpssjm-hari-oms-projects.vercel.app',
        'https://live-poll-gxy5-*.vercel.app',
        'https://*.vercel.app'
    ];

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow requests with no origin
            if (!origin) return callback(null, true);

            // Check if origin matches any allowed origin
            const isAllowed = allowedOrigins.some(allowedOrigin => {
                if (allowedOrigin === '*') return true;
                if (allowedOrigin.includes('*')) {
                    const pattern = allowedOrigin.replace(/\*/g, '.*');
                    const regex = new RegExp(`^${pattern}$`);
                    return regex.test(origin);
                }
                return allowedOrigin === origin;
            });

            return callback(null, isAllowed ? origin : false);
        },
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
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
                const pattern = allowedOrigin.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(origin);
            }
            return allowedOrigin === origin;
        });

        if (isAllowed) {
            return callback(null, origin);
        } else {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
}));

// Add preflight handling
app.options('*', cors());

// Additional middleware to ensure CORS headers are always present
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin) {
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin === '*') return true;
            if (allowedOrigin.includes('*')) {
                const pattern = allowedOrigin.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(origin);
            }
            return allowedOrigin === origin;
        });

        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        }
    }
    
    next();
});

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
