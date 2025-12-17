const pool = require('../config/database');
const bcrypt = require('bcrypt');

const Admin = {
    // Create new admin
    create: async (adminData) => {
        const { username, email, password, role = 'admin' } = adminData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        
        return { id: result.insertId, username, email, role };
    },
    
    // Find admin by email
    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        return rows[0];
    },
    
    // Find admin by username
    findByUsername: async (username) => {
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
        return rows[0];
    },
    
    // Find admin by ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT id, username, email, role, created_at FROM admins WHERE id = ?', [id]);
        return rows[0];
    },
    
    // Verify password
    verifyPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },
    
    // Get all admins
    getAll: async () => {
        const [rows] = await pool.query('SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC');
        return rows;
    },
    
    // Update admin
    update: async (id, adminData) => {
        const fields = [];
        const values = [];
        
        if (adminData.username) {
            fields.push('username = ?');
            values.push(adminData.username);
        }
        
        if (adminData.email) {
            fields.push('email = ?');
            values.push(adminData.email);
        }
        
        if (adminData.password) {
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            fields.push('password = ?');
            values.push(hashedPassword);
        }
        
        if (adminData.role) {
            fields.push('role = ?');
            values.push(adminData.role);
        }
        
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        
        values.push(id);
        const query = `UPDATE admins SET ${fields.join(', ')} WHERE id = ?`;
        
        await pool.query(query, values);
        return Admin.findById(id);
    },
    
    // Delete admin
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Admin;
