-- Migration: Add missing columns to products table based on latest schema
-- This script safely adds columns if they don't already exist.

-- 1. Add price_sml
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'price_sml');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN price_sml DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER price', 'SELECT "Column price_sml already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. Add price_xl_2xl
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'price_xl_2xl');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN price_xl_2xl DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER price_sml', 'SELECT "Column price_xl_2xl already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. Add subcategory
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'subcategory');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN subcategory VARCHAR(100) NULL AFTER category', 'SELECT "Column subcategory already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 4. Add image_url_2
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'image_url_2');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN image_url_2 VARCHAR(500) DEFAULT NULL AFTER image_url', 'SELECT "Column image_url_2 already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 5. Add image_url_3
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'image_url_3');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN image_url_3 VARCHAR(500) DEFAULT NULL AFTER image_url_2', 'SELECT "Column image_url_3 already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 6. Add size_chart_url
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'size_chart_url');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN size_chart_url VARCHAR(500) DEFAULT NULL AFTER image_url_3', 'SELECT "Column size_chart_url already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 7. Add images (JSON gallery)
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'images');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN images LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)) AFTER size_chart_url', 'SELECT "Column images already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 8. Add latest_arrival
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'latest_arrival');
SET @sql = IF(@exists = 0, 'ALTER TABLE products ADD COLUMN latest_arrival TINYINT(1) DEFAULT 0 AFTER featured', 'SELECT "Column latest_arrival already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 9. Backfill price columns for existing rows if they are 0
UPDATE products 
SET price_sml = IF(price_sml = 0, price, price_sml),
    price_xl_2xl = IF(price_xl_2xl = 0, price, price_xl_2xl);

-- 10. Ensure index for subcategory exists
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND INDEX_NAME = 'idx_subcategory');
SET @sql = IF(@index_exists = 0, 'ALTER TABLE products ADD INDEX idx_subcategory (subcategory)', 'SELECT "Index idx_subcategory already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
