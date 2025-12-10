const express = require('express');
const dotenv = require('dotenv');

const userRoutes = require('./api/v1/routes/userRoutes');
const { notFound, errorHandler } = require('./utils/errorHandler');
const { logInfo } = require('./utils/logger');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => logInfo(`API listening on port ${port}`));

module.exports = app;
