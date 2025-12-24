-- Add coming_soon column to subcategories table
ALTER TABLE subcategories 
ADD COLUMN coming_soon TINYINT(1) DEFAULT 0 AFTER name;
