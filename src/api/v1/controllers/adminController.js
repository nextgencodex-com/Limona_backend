const Admin = require('../../../models/Admin');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');
const { logError, logInfo } = require('../../../utils/logger');

// Register new admin (only super_admin can do this)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username, email, and password are required' 
            });
        }
        
        // Check if admin already exists
        const existingEmail = await Admin.findByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ success: false, error: 'Email already registered' });
        }
        
        const existingUsername = await Admin.findByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ success: false, error: 'Username already taken' });
        }
        
        // Create admin
        const admin = await Admin.create({ username, email, password, role });
        
        logInfo(`New admin registered: ${email}`);
        res.status(201).json({ success: true, data: admin });
    } catch (error) {
        logError('Error registering admin:', error);
        res.status(500).json({ success: false, error: 'Failed to register admin' });
    }
};

// Login admin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email and password are required' 
            });
        }
        
        // Find admin
        const admin = await Admin.findByEmail(email);
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Verify password
        const validPassword = await Admin.verifyPassword(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        logInfo(`Admin logged in: ${email}`);
        
        res.json({
            success: true,
            data: {
                token,
                admin: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        logError('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Failed to login' });
    }
};

// Get current admin profile
exports.getProfile = async (req, res) => {
    try {
        res.json({ success: true, data: req.admin });
    } catch (error) {
        logError('Error fetching profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updateData = {};
        
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        
        const updatedAdmin = await Admin.update(req.admin.id, updateData);
        
        res.json({ success: true, data: updatedAdmin });
    } catch (error) {
        logError('Error updating profile:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

// Get all admins (super_admin only)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.getAll();
        res.json({ success: true, data: admins });
    } catch (error) {
        logError('Error fetching admins:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admins' });
    }
};

// Delete admin (super_admin only)
exports.deleteAdmin = async (req, res) => {
    try {
        const deleted = await Admin.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }
        
        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        logError('Error deleting admin:', error);
        res.status(500).json({ success: false, error: 'Failed to delete admin' });
    }
};
