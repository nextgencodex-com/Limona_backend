-- Add size-based pricing columns to products

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

-- Backfill new columns for existing products
UPDATE products
SET
    price_sml = COALESCE(NULLIF(price_sml, 0), price),
    price_xl_2xl = COALESCE(NULLIF(price_xl_2xl, 0), price);
