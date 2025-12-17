const pool = require('../config/database');

const Product = {
    // Get all products with optional filters
    getAll: async (filters = {}) => {
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        
        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }
        
        if (filters.is_active !== undefined) {
            query += ' AND is_active = ?';
            params.push(filters.is_active);
        }
        
        if (filters.featured !== undefined) {
            query += ' AND featured = ?';
            params.push(filters.featured);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await pool.query(query, params);
        return rows;
    },
    
    // Get product by ID
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },
    
    // Create new product
    create: async (productData) => {
        const {
            name,
            description,
            price,
            category,
            size,
            color,
            stock,
            image_url,
            images,
            is_active,
            featured
        } = productData;
        
        const [result] = await pool.query(
            `INSERT INTO products (name, description, price, category, size, color, stock, image_url, images, is_active, featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, category, size || null, color || null, stock || 0, image_url || null, 
             images ? JSON.stringify(images) : null, is_active !== undefined ? is_active : true, featured || false]
        );
        
        return { id: result.insertId, ...productData };
    },
    
    // Update product
    update: async (id, productData) => {
        const fields = [];
        const values = [];
        
        Object.keys(productData).forEach(key => {
            if (key === 'images' && productData[key]) {
                fields.push(`${key} = ?`);
                values.push(JSON.stringify(productData[key]));
            } else if (productData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(productData[key]);
            }
        });
        
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        
        values.push(id);
        const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
        
        await pool.query(query, values);
        return Product.getById(id);
    },
    
    // Delete product
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
    
    // Update stock
    updateStock: async (id, quantity) => {
        await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, id]);
        return Product.getById(id);
    },
    
    // Search products
    search: async (searchTerm) => {
        const [rows] = await pool.query(
            `SELECT * FROM products 
             WHERE (name LIKE ? OR description LIKE ? OR category LIKE ?) 
             AND is_active = TRUE
             ORDER BY featured DESC, created_at DESC`,
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }
};

module.exports = Product;
