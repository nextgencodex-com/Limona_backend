const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./api/v1/routes/userRoutes');
const productRoutes = require('./api/v1/routes/productRoutes');
const adminRoutes = require('./api/v1/routes/adminRoutes');
const uploadRoutes = require('./api/v1/routes/uploadRoutes');
const categoryRoutes = require('./api/v1/routes/categoryRoutes');
const { notFound, errorHandler } = require('./utils/errorHandler');
const { logInfo } = require('./utils/logger');
const debugRoutes = require('./api/v1/routes/debugRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets from the backend (so the frontend can be static)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/debug', debugRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => logInfo(`API listening on port ${port}`));

module.exports = app;
