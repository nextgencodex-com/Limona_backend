const path = require('path');
const fs = require('fs').promises;
const { logError, logInfo } = require('../../../utils/logger');
const { productUploadsDir } = require('../../../utils/upload');

const APP_URL = (process.env.APP_URL || '').replace(/\/$/, '');

// Upload product image
exports.uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded' 
            });
        }

        // Store path relative to backend so it works with static frontends
        const relativePath = `/uploads/products/${req.file.filename}`;
        const publicUrl = APP_URL ? `${APP_URL}${relativePath}` : relativePath;

        logInfo(`Image uploaded: ${relativePath}`);
        
        res.json({
            success: true,
            data: {
                image_url: publicUrl,
                relative_path: relativePath
            }
        });
    } catch (error) {
        logError('Error uploading image:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to upload image' 
        });
    }
};

// Delete product image
exports.deleteProductImage = async (req, res) => {
    try {
        const { imagePath } = req.body;
        
        if (!imagePath) {
            return res.status(400).json({ 
                success: false, 
                error: 'Image path required' 
            });
        }

        // Convert URL (or relative path) to file system path
        const normalizedPath = imagePath.replace(/^https?:\/\/[^/]+/, '');
        const fileName = path.basename(normalizedPath);
        const backendImagePath = path.join(productUploadsDir, fileName);
        
        // Check if file exists
        try {
            await fs.access(backendImagePath);
            await fs.unlink(backendImagePath);
            logInfo(`Image deleted: ${imagePath}`);
            
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } catch (err) {
            // File doesn't exist or already deleted
            res.json({
                success: true,
                message: 'Image not found or already deleted'
            });
        }
    } catch (error) {
        logError('Error deleting image:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete image' 
        });
    }
};
