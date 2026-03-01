-- Add granular permissions to users table
ALTER TABLE users ADD COLUMN can_edit_products BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN can_delete_products BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing admin to have all permissions
UPDATE users SET can_edit_products = TRUE, can_delete_products = TRUE WHERE role = 'ADMIN';
