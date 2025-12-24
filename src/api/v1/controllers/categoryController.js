const categoryService = require('../../../services/categoryService');
const { logError } = require('../../../utils/logger');

// Get all categories
const getCategories = async (req, res) => {
	try {
		const categories = await categoryService.getAllCategories();
		res.json(categories);
	} catch (error) {
		logError(error);
		res.status(500).json({ message: 'Error fetching categories', error: error.message });
	}
};

// Get single category
const getCategory = async (req, res) => {
	try {
		const category = await categoryService.getCategoryById(req.params.id);
		
		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		res.json(category);
	} catch (error) {
		logError(error);
		res.status(500).json({ message: 'Error fetching category', error: error.message });
	}
};

// Create category
const createCategory = async (req, res) => {
	try {
		const { name, coming_soon, display_order } = req.body;

		if (!name) {
			return res.status(400).json({ message: 'Category name is required' });
		}

		const category = await categoryService.createCategory({
			name,
			coming_soon: coming_soon || false,
			display_order: display_order || 0
		});

		res.status(201).json(category);
	} catch (error) {
		logError(error);
		
		if (error.message.includes('already exists')) {
			return res.status(409).json({ message: error.message });
		}

		res.status(500).json({ message: 'Error creating category', error: error.message });
	}
};

// Update category
const updateCategory = async (req, res) => {
	try {
		const { name, coming_soon, display_order, is_active } = req.body;

		const category = await categoryService.updateCategory(req.params.id, {
			name,
			coming_soon,
			display_order,
			is_active
		});

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		res.json(category);
	} catch (error) {
		logError(error);
		
		if (error.message.includes('already exists')) {
			return res.status(409).json({ message: error.message });
		}

		res.status(500).json({ message: 'Error updating category', error: error.message });
	}
};

// Delete category
const deleteCategory = async (req, res) => {
	try {
		const success = await categoryService.deleteCategory(req.params.id);

		if (!success) {
			return res.status(404).json({ message: 'Category not found' });
		}

		res.json({ message: 'Category deleted successfully' });
	} catch (error) {
		logError(error);
		res.status(500).json({ message: 'Error deleting category', error: error.message });
	}
};

// Create subcategory
const createSubcategory = async (req, res) => {
	try {
		const { category_id, name, display_order } = req.body;

		if (!category_id || !name) {
			return res.status(400).json({ message: 'Category ID and subcategory name are required' });
		}

		const subcategory = await categoryService.createSubcategory({
			category_id,
			name,
			display_order: display_order || 0
		});

		res.status(201).json(subcategory);
	} catch (error) {
		logError(error);
		
		if (error.message.includes('already exists')) {
			return res.status(409).json({ message: error.message });
		}

		res.status(500).json({ message: 'Error creating subcategory', error: error.message });
	}
};

// Update subcategory
const updateSubcategory = async (req, res) => {
	try {
		const { name, coming_soon, display_order, is_active } = req.body;

		const subcategory = await categoryService.updateSubcategory(req.params.id, {
			name,
			coming_soon,
			display_order,
			is_active
		});

		if (!subcategory) {
			return res.status(404).json({ message: 'Subcategory not found' });
		}

		res.json(subcategory);
	} catch (error) {
		logError(error);
		
		if (error.message.includes('already exists')) {
			return res.status(409).json({ message: error.message });
		}

		res.status(500).json({ message: 'Error updating subcategory', error: error.message });
	}
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
	try {
		const success = await categoryService.deleteSubcategory(req.params.id);

		if (!success) {
			return res.status(404).json({ message: 'Subcategory not found' });
		}

		res.json({ message: 'Subcategory deleted successfully' });
	} catch (error) {
		logError(error);
		res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
	}
};

module.exports = {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	createSubcategory,
	updateSubcategory,
	deleteSubcategory
};
