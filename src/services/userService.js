const { db } = require('../config');

async function pingDatabase() {
	// Simple query to verify connectivity and credentials.
	const [rows] = await db.query('SELECT 1 AS ok');
	return rows[0];
}

module.exports = {
	pingDatabase
};
