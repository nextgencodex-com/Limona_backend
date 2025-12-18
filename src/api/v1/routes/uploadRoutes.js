const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadProductImage } = require('../../../utils/upload');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Upload product image (protected route)
router.post('/product-image', 
    authenticateToken, 
    uploadProductImage.single('image'), 
    uploadController.uploadProductImage
);

// Delete product image (protected route)
router.delete('/product-image', 
    authenticateToken, 
    uploadController.deleteProductImage
);

module.exports = router;
