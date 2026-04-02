-- Limona Database Schema
-- Run this file in phpMyAdmin or MySQL command line

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS sriltfwe_limona;
USE sriltfwe_limona;

-- Admin users table for authentication
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    price_sml DECIMAL(10, 2) NOT NULL,
    price_xl_2xl DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    size VARCHAR(50),
    color VARCHAR(50),
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    images JSON,
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    latest_arrival BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_subcategory (subcategory),
    INDEX idx_is_active (is_active),
    INDEX idx_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_customer_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
-- Note: This is a bcrypt hash of 'admin123' - CHANGE THIS IN PRODUCTION!
INSERT INTO admins (username, email, password, role) 
VALUES ('admin', 'admin@limona.com', '$2b$10$YourBcryptHashHere', 'super_admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample products
INSERT INTO products (name, description, price, price_sml, price_xl_2xl, category, size, color, stock, image_url, featured) VALUES
('Classic White T-Shirt', 'Premium cotton t-shirt with comfortable fit', 29.99, 29.99, 34.99, 'T-Shirts', 'M', 'White', 50, '/images/T-Shirts/white-tshirt.jpg', TRUE),
('Vintage Denim Jacket', 'Authentic vintage style denim jacket', 89.99, 89.99, 99.99, 'Vintage-Jacket', 'L', 'Blue', 30, '/images/Vintage-Jacket/denim.jpg', TRUE),
('Oversized Hoodie', 'Cozy oversized hoodie perfect for casual wear', 49.99, 49.99, 54.99, 'Hoodies', 'XL', 'Black', 40, '/images/Hoodies/black-hoodie.jpg', TRUE),
('Summer Floral Frock', 'Beautiful floral pattern summer dress', 59.99, 59.99, 64.99, 'Frock', 'M', 'Floral', 25, '/images/Frock/floral-frock.jpg', FALSE),
('Casual Shorts', 'Comfortable cotton shorts for summer', 34.99, 34.99, 39.99, 'Shorts', 'L', 'Khaki', 35, '/images/Shorts/khaki-shorts.jpg', FALSE)
ON DUPLICATE KEY UPDATE name=name;
