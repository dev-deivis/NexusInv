-- Initial Data Seed

-- Default Admin User (Password: admin123)
-- In a real scenario, this password should be hashed with BCrypt. 
-- For the first run, we'll use a placeholder that matches what BCrypt would produce for 'admin123'.
-- $2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgNo7Y9M.0.zJ6V9qI1uX6u1rY3K is 'admin123'
INSERT INTO users (name, email, password, role, active) 
VALUES ('System Admin', 'admin@inventory.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgNo7Y9M.0.zJ6V9qI1uX6u1rY3K', 'ADMIN', true);

-- Sample Categories
INSERT INTO categories (name, description) VALUES ('Electronics', 'Electronic devices and components');
INSERT INTO categories (name, description) VALUES ('Office Supplies', 'General office equipment');

-- Sample Suppliers
INSERT INTO suppliers (company_name, contact_name, email, phone) 
VALUES ('Tech Corp', 'John Doe', 'contact@techcorp.com', '+1-555-0101');

-- Sample Product
INSERT INTO products (name, description, sku, unit_price, current_stock, min_stock, category_id, supplier_id)
VALUES ('Laptop Pro 15', 'High performance laptop', 'LAP-001', 1200.00, 10, 3, 1, 1);
