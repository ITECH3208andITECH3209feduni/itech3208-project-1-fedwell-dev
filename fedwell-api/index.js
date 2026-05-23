require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173'
  ]
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/records', recordRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'FedWELL API is running',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`FedWELL API listening on port ${PORT}`);
});