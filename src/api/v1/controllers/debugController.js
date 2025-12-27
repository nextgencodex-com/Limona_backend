const pool = require('../../../config/database');

exports.dbInfo = async (req, res) => {
  try {
    const [[dbRow]] = await pool.query('SELECT DATABASE() AS db');
    const [tables] = await pool.query('SHOW TABLES');

    let productsColumns = null;
    let productsCount = null;
    try {
      const [cols] = await pool.query('SHOW COLUMNS FROM products');
      productsColumns = cols;
      const [[cnt]] = await pool.query('SELECT COUNT(*) AS cnt FROM products');
      productsCount = cnt.cnt;
    } catch (_) {
      // products table missing
    }

    res.json({
      success: true,
      data: {
        database: dbRow?.db || null,
        tables,
        products: {
          exists: !!productsColumns,
          columns: productsColumns,
          count: productsCount,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
