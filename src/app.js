const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./api/v1/routes/userRoutes');
const productRoutes = require('./api/v1/routes/productRoutes');
const adminRoutes = require('./api/v1/routes/adminRoutes');
const uploadRoutes = require('./api/v1/routes/uploadRoutes');
const categoryRoutes = require('./api/v1/routes/categoryRoutes');
const { notFound, errorHandler } = require('./utils/errorHandler');
const { logInfo } = require('./utils/logger');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handlers
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => logInfo(`API listening on port ${port}`));

module.exports = app;
