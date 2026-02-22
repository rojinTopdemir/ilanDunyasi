const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const listingsRouter = require('./routes/listings');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const messagesRouter = require('./routes/messages');
const app = express();
const adminRouter = require('./routes/admin');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/admin', adminRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/messages', messagesRouter);

app.get('/', (req, res) => {
    res.json({ mesaj: 'Sunucu çalışıyor! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});