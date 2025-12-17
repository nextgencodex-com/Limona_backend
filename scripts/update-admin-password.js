// Update admin password with correct bcrypt hash
require('dotenv').config();
const mysql = require('mysql2/promise');

async function updatePassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3307,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'limona'
    });

    const hash = '$2b$10$XCujpYI.c91eT3sd.FP9/etFaeQvXwGjEiPtUWBL80BYZDBKvUA0W';
    
    await connection.execute(
      'UPDATE admins SET password = ? WHERE email = ?',
      [hash, 'admin@limona.com']
    );

    console.log('✅ Admin password updated successfully!');
    console.log('You can now login with:');
    console.log('Email: admin@limona.com');
    console.log('Password: admin123');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updatePassword();
