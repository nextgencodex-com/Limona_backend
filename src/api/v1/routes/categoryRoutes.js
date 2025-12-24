const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Category routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Subcategory routes
router.post('/subcategories', categoryController.createSubcategory);
router.put('/subcategories/:id', categoryController.updateSubcategory);
router.delete('/subcategories/:id', categoryController.deleteSubcategory);

module.exports = router;
