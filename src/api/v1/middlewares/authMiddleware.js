const jwt = require('jsonwebtoken');
const Admin = require('../../../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
            
            // Get admin details from database
            const admin = await Admin.findById(decoded.id);
            
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
            
            req.admin = admin;
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: 'Authentication error' });
    }
};

// Middleware to check if admin has super_admin role
const requireSuperAdmin = (req, res, next) => {
    if (req.admin.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super admin access required' });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireSuperAdmin,
    JWT_SECRET
};
