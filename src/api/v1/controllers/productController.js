const Product = require('../../../models/Product');
const { logError, logInfo } = require('../../../utils/logger');
const { productUploadsDir } = require('../../../utils/upload');

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
        // Basic normalization
        if (productData.price !== undefined) {
            productData.price = Number(productData.price);
        }
        if (productData.stock !== undefined) {
            productData.stock = Number(productData.stock);
        }

        // Validation
        if (!productData.name || productData.price === undefined || !productData.category) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, price, and category are required' 
            });
        }

        logInfo('Creating product', { byAdminId: req.admin?.id, name: productData.name, category: productData.category, price: productData.price });
        const product = await Product.create(productData);
        logInfo('Product created', { id: product.id });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        const errMsg = error?.sqlMessage || error?.message || 'Failed to create product';
        logError('Error creating product:', errMsg);
        res.status(500).json({ success: false, error: errMsg });
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
        
        // Delete associated image file if it exists
        if (product.image_url) {
            try {
                const path = require('path');
                const fs = require('fs').promises;
                const normalizedPath = product.image_url.replace(/^https?:\/\/[^/]+/, '');
                const fileName = path.basename(normalizedPath);
                const imagePath = path.join(productUploadsDir, fileName);

                // Try to delete the file, but don't fail if it doesn't exist
                await fs.unlink(imagePath);
                logInfo(`Product image deleted: ${product.image_url}`);
            } catch (imgError) {
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
