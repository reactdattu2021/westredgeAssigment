require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Rate limiting — 60 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// Routes
app.use('/api', chatRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Support Assistant API running.' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: err.message || 'Internal server error.' });
});

// DB + Server bootstrap
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('[DB] MongoDB connected.');
        app.listen(PORT, () => console.log(`[SERVER] Running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('[DB] Connection failed:', err.message);
        process.exit(1);
    });
