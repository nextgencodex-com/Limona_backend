const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
	host: process.env.DB_HOST || '127.0.0.1',
	port: Number(process.env.DB_PORT) || 3306,
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'limona',
	waitForConnections: true,
	connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
	queueLimit: 0,
	connectTimeout: 10000,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0
});

// Test connection on startup
pool.getConnection()
	.then(connection => {
		console.log('✓ Database connected successfully');
		connection.release();
	})
	.catch(err => {
		console.error('✗ Database connection failed:', err.message);
		console.error('  Check if MySQL is running and credentials are correct');
		console.error(`  Trying to connect to: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}`);
	});

module.exports = pool;
