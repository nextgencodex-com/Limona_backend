const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
  const migrationArg = process.argv[2];
  if (!migrationArg) {
    throw new Error('Usage: node scripts/run-sql-migration.js <sql-file-path>');
  }

  const migrationPath = path.resolve(process.cwd(), migrationArg);
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'limona',
    multipleStatements: true,
  });

  try {
    await connection.query(sql);

    const [rows] = await connection.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'products'
         AND COLUMN_NAME IN ('price_sml', 'price_xl_2xl')
       ORDER BY COLUMN_NAME`
    );

    const foundColumns = rows.map((r) => r.COLUMN_NAME);
    const hasPriceSml = foundColumns.includes('price_sml');
    const hasPriceXl2xl = foundColumns.includes('price_xl_2xl');

    if (!hasPriceSml || !hasPriceXl2xl) {
      throw new Error(`Migration completed but expected columns missing. Found: ${foundColumns.join(', ')}`);
    }

    console.log('Migration executed successfully. Verified columns: price_sml, price_xl_2xl');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
