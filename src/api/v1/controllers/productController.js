const Product = require('../../../models/Product');
const { logError, logInfo } = require('../../../utils/logger');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { category, is_active, featured } = req.query;
        
        const filters = {};
        if (category) filters.category = category;
        if (is_active !== undefined) filters.is_active = is_active === 'true';
        if (featured !== undefined) filters.featured = featured === 'true';
        
        const products = await Product.getAll(filters);
        res.json({ success: true, data: products });
    } catch (error) {
        logError('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        res.json({ success: true, data: product });
    } catch (error) {
        logError('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
};

// Create new product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        // Validation
        if (!productData.name || !productData.price || !productData.category) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, price, and category are required' 
            });
        }
        
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        logError('Error creating product:', error);
        res.status(500).json({ success: false, error: 'Failed to create product' });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const productData = req.body;
        const product = await Product.update(req.params.id, productData);
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        res.json({ success: true, data: product });
    } catch (error) {
        logError('Error updating product:', error);
        res.status(500).json({ success: false, error: 'Failed to update product' });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        // Get product details before deleting to retrieve image path
        const product = await Product.getById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        // Delete the product from database
        const deleted = await Product.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        // Delete associated image files if they exist
        const imagesToDelete = [
            product.image_url,
            product.image_url_2,
            product.image_url_3,
            product.size_chart_url
        ].filter(Boolean); // Remove null/undefined values
        
        if (imagesToDelete.length > 0) {
            try {
                const path = require('path');
                const fs = require('fs').promises;
                
                for (const imageUrl of imagesToDelete) {
                    try {
                        const fileName = path.basename(imageUrl);
                        const imagePath = path.join(__dirname, '../../../../../limona/public/images/Products', fileName);
                        await fs.unlink(imagePath);
                        logInfo(`Product image deleted: ${imageUrl}`);
                    } catch (imgError) {
                        // Continue deleting other images even if one fails
                        logError(`Failed to delete image ${imageUrl}:`, imgError);
                    }
                }
            } catch (error) {
                // Log but don't fail the deletion if image removal fails
                logError('Error deleting product image:', imgError);
            }
        }
        
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        logError('Error deleting product:', error);
        res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
};

// Search products
exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, error: 'Search query required' });
        }
        
        const products = await Product.search(q);
        res.json({ success: true, data: products });
    } catch (error) {
        logError('Error searching products:', error);
        res.status(500).json({ success: false, error: 'Failed to search products' });
    }
};

// Update stock
exports.updateStock = async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (quantity === undefined) {
            return res.status(400).json({ success: false, error: 'Quantity is required' });
        }
        
        const product = await Product.updateStock(req.params.id, quantity);
        res.json({ success: true, data: product });
    } catch (error) {
        logError('Error updating stock:', error);
        res.status(500).json({ success: false, error: 'Failed to update stock' });
    }
};
