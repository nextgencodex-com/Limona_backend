const path = require('path');
const fs = require('fs').promises;
const { logError, logInfo } = require('../../../utils/logger');

// Upload product image
exports.uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded' 
            });
        }

        // The file path relative to public directory
        const imagePath = `/images/Products/${req.file.filename}`;
        
        logInfo(`Image uploaded: ${imagePath}`);
        
        res.json({
            success: true,
            data: {
                image_url: imagePath
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

        // Convert URL path to file system path
        const fileName = path.basename(imagePath);
        const frontendImagePath = path.join(__dirname, '../../../../../limona/public/images/Products', fileName);
        
        // Check if file exists
        try {
            await fs.access(frontendImagePath);
            await fs.unlink(frontendImagePath);
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
