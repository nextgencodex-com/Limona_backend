-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    coming_soon BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_subcategory (category_id, name)
);

-- Insert existing categories
INSERT INTO categories (name, coming_soon, display_order) VALUES
('All Products', FALSE, 1),
('Men', FALSE, 2),
('Women', FALSE, 3),
('Kids', FALSE, 4),
('Accessories', TRUE, 5),
('Limited Edition', TRUE, 6),
('Gym wear', TRUE, 7)
ON DUPLICATE KEY UPDATE name=name;

-- Insert existing subcategories
INSERT INTO subcategories (category_id, name, display_order) VALUES
((SELECT id FROM categories WHERE name='Women'), 'Blouse', 1),
((SELECT id FROM categories WHERE name='Women'), 'Frock', 2),
((SELECT id FROM categories WHERE name='Women'), 'Full Kits', 3),
((SELECT id FROM categories WHERE name='Women'), 'T-Shirt', 4),
((SELECT id FROM categories WHERE name='Gym wear'), 'Men', 1),
((SELECT id FROM categories WHERE name='Gym wear'), 'Women', 2)
ON DUPLICATE KEY UPDATE name=name;
