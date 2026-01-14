-- ==========================================
-- CleanHome Dev User for Smoke Tests
-- ==========================================
-- User: test@viclean.com
-- Password: Secret123
-- BCrypt hash generated for 'Secret123'

INSERT INTO users (email, password, first_name, last_name, phone_number, street_address, city, state, postal_code, role, is_active, is_verified, created_at)
VALUES (
    'test@viclean.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    'Test', 
    'User', 
    '+57 300 555 1234', 
    'Calle Test #123', 
    'Bogotá', 
    'Cundinamarca', 
    '110111', 
    'CUSTOMER', 
    true, 
    true, 
    CURRENT_TIMESTAMP
);
