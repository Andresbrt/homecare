-- ==========================================
-- CleanHome Production Seed Data - MySQL
-- Datos iniciales para ambiente de producción
-- ==========================================

-- Admin user (password: Admin@2025!)
-- BCrypt hash generado con fuerza 10
INSERT INTO users (email, password, first_name, last_name, role, is_active, is_verified, created_at)
VALUES ('admin@cleanhome.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Admin', 'CleanHome', 'ADMIN', TRUE, TRUE, NOW());

-- Test customer user (password: Customer@2025!)
INSERT INTO users (email, password, first_name, last_name, phone_number, street_address, city, state, postal_code, latitude, longitude, role, is_active, is_verified, created_at)
VALUES (
    'juan.perez@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu',
    'Juan',
    'Pérez',
    '+57 300 123 4567',
    'Calle 123 #45-67',
    'Bogotá',
    'Cundinamarca',
    '110111',
    4.7110,
    -74.0721,
    'CUSTOMER',
    TRUE,
    TRUE,
    NOW()
);

-- Test service provider user (password: Provider@2025!)
INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_active, is_verified, created_at)
VALUES (
    'maria.gonzalez@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu',
    'María',
    'González',
    '+57 310 987 6543',
    'SERVICE_PROVIDER',
    TRUE,
    TRUE,
    NOW()
);

-- Service provider profile
INSERT INTO service_providers (user_id, business_name, description, years_experience, hourly_rate, service_radius, is_available, is_verified, rating_average, total_ratings, total_bookings, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com'),
    'CleanPro Services',
    'Servicio profesional de limpieza con más de 5 años de experiencia. Especialistas en limpieza profunda, mantenimiento regular y servicios corporativos. Certificados y asegurados.',
    5,
    25000.00,
    15.00,
    TRUE,
    TRUE,
    4.85,
    127,
    450,
    NOW()
);

-- Provider service types
INSERT INTO provider_services (provider_id, service_type)
VALUES
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')), 'BASIC_CLEANING'),
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')), 'DEEP_CLEANING'),
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')), 'OFFICE_CLEANING'),
    ((SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')), 'WINDOW_CLEANING');

-- Sample services catalog
INSERT INTO services (service_provider_id, name, description, service_type, base_price, estimated_duration_hours, is_active, created_at)
VALUES
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')),
        'Limpieza Básica Residencial',
        'Servicio de limpieza general para hogares: barrido, trapeo, limpieza de baños, cocina, habitaciones y áreas comunes. Ideal para mantenimiento regular semanal o quincenal.',
        'BASIC_CLEANING',
        50000.00,
        2,
        TRUE,
        NOW()
    ),
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')),
        'Limpieza Profunda Premium',
        'Limpieza exhaustiva y detallada que incluye: limpieza de ventanas, muebles, electrodomésticos por dentro y fuera, rincones, techos, paredes, organización de espacios y desinfección completa.',
        'DEEP_CLEANING',
        120000.00,
        4,
        TRUE,
        NOW()
    ),
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')),
        'Limpieza Corporativa de Oficinas',
        'Servicio especializado para espacios de trabajo: limpieza de escritorios, áreas comunes, salas de juntas, cocina corporativa, baños, recepción y manejo de residuos. Disponible en horarios flexibles.',
        'OFFICE_CLEANING',
        80000.00,
        3,
        TRUE,
        NOW()
    ),
    (
        (SELECT id FROM service_providers WHERE user_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@example.com')),
        'Limpieza de Ventanas y Vidrios',
        'Limpieza profesional de ventanas, puertas de vidrio, espejos y superficies transparentes. Incluye marcos, rieles y eliminación de manchas difíciles.',
        'WINDOW_CLEANING',
        45000.00,
        2,
        TRUE,
        NOW()
    );
