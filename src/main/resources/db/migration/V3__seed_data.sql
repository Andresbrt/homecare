-- ==========================================
-- CleanHome Seed Data for Development
-- ==========================================

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, is_active, is_verified, created_at)
VALUES ('admin@cleanhome.com', '$2a$10$ZK5VQnJ5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ', 'Admin', 'CleanHome', 'ADMIN', true, true, CURRENT_TIMESTAMP);

-- Insert test customer (password: customer123)
INSERT INTO users (email, password, first_name, last_name, phone_number, street_address, city, state, postal_code, role, is_active, is_verified, created_at)
VALUES ('customer@test.com', '$2a$10$ZK5VQnJ5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ', 'Juan', 'Pérez', '+57 300 123 4567', 'Calle 123 #45-67', 'Bogotá', 'Cundinamarca', '110111', 'CUSTOMER', true, true, CURRENT_TIMESTAMP);

-- Insert test service provider (password: provider123)
INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_active, is_verified, created_at)
VALUES ('provider@test.com', '$2a$10$ZK5VQnJ5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ9X5X9hXJ', 'María', 'González', '+57 310 987 6543', 'SERVICE_PROVIDER', true, true, CURRENT_TIMESTAMP);

-- Insert service provider profile
INSERT INTO service_providers (user_id, business_name, description, years_experience, hourly_rate, service_radius, is_available, is_verified, rating_average, total_ratings, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'provider@test.com'),
    'CleanPro Services',
    'Servicio profesional de limpieza con más de 5 años de experiencia. Especialistas en limpieza profunda y mantenimiento regular.',
    5,
    25000.00,
    10.00,
    true,
    true,
    4.8,
    127,
    CURRENT_TIMESTAMP
);

-- Insert provider service types
INSERT INTO provider_services (provider_id, service_type)
VALUES
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')), 'BASIC_CLEANING'),
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')), 'DEEP_CLEANING'),
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')), 'OFFICE_CLEANING');

-- Insert sample services
INSERT INTO services (service_provider_id, name, description, service_type, base_price, estimated_duration_hours, is_active, created_at)
VALUES
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')),
        'Limpieza Básica',
        'Limpieza general de espacios: barrido, trapeo, limpieza de superficies y organización básica.',
        'BASIC_CLEANING',
        50000.00,
        2,
        true,
        CURRENT_TIMESTAMP
    ),
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')),
        'Limpieza Profunda',
        'Limpieza exhaustiva incluyendo: ventanas, muebles, electrodomésticos, rincones y áreas de difícil acceso.',
        'DEEP_CLEANING',
        120000.00,
        4,
        true,
        CURRENT_TIMESTAMP
    ),
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')),
        'Limpieza de Oficina',
        'Limpieza especializada para espacios de trabajo: escritorios, áreas comunes, cocina corporativa y baños.',
        'OFFICE_CLEANING',
        80000.00,
        3,
        true,
        CURRENT_TIMESTAMP
    );
