const pool = require('../config/database');
const { logError } = require('../utils/logger');

class CategoryService {
	// Get all categories with their subcategories
	async getAllCategories(options = {}) {
		const {
			includeInactive = false,
			includeInactiveSubcategories = includeInactive
		} = options;

		try {
			const categoryWhereClause = includeInactive ? '' : 'WHERE c.is_active = true';
			const subcategoryWhereClause = includeInactiveSubcategories
				? 'WHERE category_id = ?'
				: 'WHERE category_id = ? AND is_active = true';

			const [categories] = await pool.query(`
				SELECT c.*
				FROM categories c
				${categoryWhereClause}
				ORDER BY c.display_order, c.name
			`);

			// Fetch subcategories for each category
			for (const category of categories) {
				const [subcategories] = await pool.query(`
					SELECT id, name, coming_soon, display_order, is_active
					FROM subcategories
					${subcategoryWhereClause}
					ORDER BY display_order, name
				`, [category.id]);

				category.subcategories = subcategories;
			}

			return categories;
		} catch (error) {
			logError('Error fetching categories:', error);
			throw error;
		}
	}

	// Get single category by ID
	async getCategoryById(id, options = {}) {
		const {
			includeInactive = false,
			includeInactiveSubcategories = includeInactive
		} = options;

		try {
			const categoryActiveClause = includeInactive ? '' : 'AND c.is_active = true';
			const subcategoryWhereClause = includeInactiveSubcategories
				? 'WHERE category_id = ?'
				: 'WHERE category_id = ? AND is_active = true';

			const [categories] = await pool.query(`
				SELECT c.*
				FROM categories c
				WHERE c.id = ? ${categoryActiveClause}
			`, [id]);

			if (categories.length === 0) {
				return null;
			}

			const category = categories[0];

			// Fetch subcategories
			const [subcategories] = await pool.query(`
				SELECT id, name, coming_soon, display_order, is_active
				FROM subcategories
				${subcategoryWhereClause}
				ORDER BY display_order, name
			`, [id]);

			category.subcategories = subcategories;

			return category;
		} catch (error) {
			logError('Error fetching category:', error);
			throw error;
		}
	}

	// Create new category
	async createCategory(categoryData) {
		const { name, coming_soon = false, display_order = 0 } = categoryData;
		
		try {
			// Check if an inactive category with the same name exists
			const [existing] = await pool.query(
				'SELECT * FROM categories WHERE name = ? AND is_active = false',
				[name]
			);

			// If exists, reactivate it instead of creating new
			if (existing.length > 0) {
				const [result] = await pool.query(
					'UPDATE categories SET is_active = true, coming_soon = ?, display_order = ? WHERE id = ?',
					[coming_soon, display_order, existing[0].id]
				);

				return this.getCategoryById(existing[0].id);
			}

			// Otherwise create new
			const [result] = await pool.query(
				'INSERT INTO categories (name, coming_soon, display_order) VALUES (?, ?, ?)',
				[name, coming_soon, display_order]
			);
			
			return this.getCategoryById(result.insertId);
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw new Error('Category with this name already exists');
			}
			logError('Error creating category:', error);
			throw error;
		}
	}

	// Update category
	async updateCategory(id, categoryData) {
		const { name, coming_soon, display_order, is_active } = categoryData;
		
		try {
			const updates = [];
			const values = [];

			if (name !== undefined) {
				updates.push('name = ?');
				values.push(name);
			}
			if (coming_soon !== undefined) {
				updates.push('coming_soon = ?');
				values.push(coming_soon);
			}
			if (display_order !== undefined) {
				updates.push('display_order = ?');
				values.push(display_order);
			}
			if (is_active !== undefined) {
				updates.push('is_active = ?');
				values.push(is_active);
			}

			if (updates.length === 0) {
				throw new Error('No fields to update');
			}

			values.push(id);

			const [result] = await pool.query(
				`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
				values
			);

			if (result.affectedRows === 0) {
				return null;
			}

			return this.getCategoryById(id, { includeInactive: true, includeInactiveSubcategories: true });
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw new Error('Category with this name already exists');
			}
			logError('Error updating category:', error);
			throw error;
		}
	}

	// Delete category (permanent delete)
	async deleteCategory(id) {
		try {
			const [result] = await pool.query(
				'DELETE FROM categories WHERE id = ?',
				[id]
			);

			return result.affectedRows > 0;
		} catch (error) {
			logError('Error deleting category:', error);
			throw error;
		}
	}

	// Create subcategory
	async createSubcategory(subcategoryData) {
		const { category_id, name, coming_soon = false, display_order = 0 } = subcategoryData;
		
		try {
			// Check if an inactive subcategory with the same name exists
			const [existing] = await pool.query(
				'SELECT * FROM subcategories WHERE category_id = ? AND name = ? AND is_active = false',
				[category_id, name]
			);

			// If exists, reactivate it instead of creating new
			if (existing.length > 0) {
				const [result] = await pool.query(
					'UPDATE subcategories SET is_active = true, coming_soon = ?, display_order = ? WHERE id = ?',
					[coming_soon, display_order, existing[0].id]
				);

				const [subcategory] = await pool.query(
					'SELECT * FROM subcategories WHERE id = ?',
					[existing[0].id]
				);

				return subcategory[0];
			}

			// Otherwise create new
			const [result] = await pool.query(
				'INSERT INTO subcategories (category_id, name, coming_soon, display_order) VALUES (?, ?, ?, ?)',
				[category_id, name, coming_soon, display_order]
			);
			
			const [subcategory] = await pool.query(
				'SELECT * FROM subcategories WHERE id = ?',
				[result.insertId]
			);

			return subcategory[0];
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw new Error('Subcategory with this name already exists for this category');
			}
			logError('Error creating subcategory:', error);
			throw error;
		}
	}

	// Update subcategory
	async updateSubcategory(id, subcategoryData) {
		const { name, coming_soon, display_order, is_active } = subcategoryData;
		
		try {
			const updates = [];
			const values = [];

			if (name !== undefined) {
				updates.push('name = ?');
				values.push(name);
			}
			if (coming_soon !== undefined) {
				updates.push('coming_soon = ?');
				values.push(coming_soon);
			}
			if (display_order !== undefined) {
				updates.push('display_order = ?');
				values.push(display_order);
			}
			if (is_active !== undefined) {
				updates.push('is_active = ?');
				values.push(is_active);
			}

			if (updates.length === 0) {
				throw new Error('No fields to update');
			}

			values.push(id);

			const [result] = await pool.query(
				`UPDATE subcategories SET ${updates.join(', ')} WHERE id = ?`,
				values
			);

			if (result.affectedRows === 0) {
				return null;
			}

			const [subcategory] = await pool.query(
				'SELECT * FROM subcategories WHERE id = ?',
				[id]
			);

			return subcategory[0];
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw new Error('Subcategory with this name already exists for this category');
			}
			logError('Error updating subcategory:', error);
			throw error;
		}
	}

	// Delete subcategory (permanent delete)
	async deleteSubcategory(id) {
		try {
			const [result] = await pool.query(
				'DELETE FROM subcategories WHERE id = ?',
				[id]
			);

			return result.affectedRows > 0;
		} catch (error) {
			logError('Error deleting subcategory:', error);
			throw error;
		}
	}
}

module.exports = new CategoryService();
