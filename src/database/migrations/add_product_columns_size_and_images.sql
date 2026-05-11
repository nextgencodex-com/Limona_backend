-- Add size-based pricing and image-related columns to products table

-- Add price_sml column if it does not exist
SET @price_sml_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = 'price_sml'
);

SET @sql = IF(
    @price_sml_exists = 0,
    'ALTER TABLE products ADD COLUMN price_sml DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER price',
    'SELECT "Column price_sml already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add price_xl_2xl column if it does not exist
SET @price_xl_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = 'price_xl_2xl'
);

SET @sql = IF(
    @price_xl_exists = 0,
    'ALTER TABLE products ADD COLUMN price_xl_2xl DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER price_sml',
    'SELECT "Column price_xl_2xl already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Backfill new price columns for existing rows
UPDATE products
SET
    price_sml = COALESCE(NULLIF(price_sml, 0), price),
    price_xl_2xl = COALESCE(NULLIF(price_xl_2xl, 0), price);

-- Add image_url_2 column if it does not exist
SET @image2_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = 'image_url_2'
);

SET @sql = IF(
    @image2_exists = 0,
    'ALTER TABLE products ADD COLUMN image_url_2 VARCHAR(500) DEFAULT NULL AFTER image_url',
    'SELECT "Column image_url_2 already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add image_url_3 column if it does not exist
SET @image3_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = 'image_url_3'
);

SET @sql = IF(
    @image3_exists = 0,
    'ALTER TABLE products ADD COLUMN image_url_3 VARCHAR(500) DEFAULT NULL AFTER image_url_2',
    'SELECT "Column image_url_3 already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add size_chart_url column if it does not exist
SET @size_chart_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = 'size_chart_url'
);

SET @sql = IF(
    @size_chart_exists = 0,
    'ALTER TABLE products ADD COLUMN size_chart_url VARCHAR(500) DEFAULT NULL AFTER image_url_3',
    'SELECT "Column size_chart_url already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
