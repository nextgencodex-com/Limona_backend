-- Add multiple image URLs and size chart to products table
-- Check and add columns if they don't exist

-- Add image_url_2
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'limona' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'image_url_2';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN image_url_2 VARCHAR(500) DEFAULT NULL AFTER image_url',
    'SELECT "Column image_url_2 already exists" as message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add image_url_3
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'limona' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'image_url_3';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN image_url_3 VARCHAR(500) DEFAULT NULL AFTER image_url_2',
    'SELECT "Column image_url_3 already exists" as message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add size_chart_url
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'limona' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'size_chart_url';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN size_chart_url VARCHAR(500) DEFAULT NULL AFTER image_url_3',
    'SELECT "Column size_chart_url already exists" as message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Remove image_url_4 if it exists (since we only need 3 images now)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'limona' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'image_url_4';

SET @query = IF(@col_exists > 0, 
    'ALTER TABLE products DROP COLUMN image_url_4',
    'SELECT "Column image_url_4 does not exist" as message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
