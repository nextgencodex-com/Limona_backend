
ALTER TABLE products
ADD COLUMN subcategory VARCHAR(100) NULL AFTER category,
ADD COLUMN latest_arrival BOOLEAN DEFAULT FALSE AFTER featured;

ALTER TABLE products
ADD INDEX idx_subcategory (subcategory);
