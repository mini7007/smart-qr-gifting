const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/gifts', giftRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/smartqr');

app.listen(5000, () => console.log('Server running on 5000'));
