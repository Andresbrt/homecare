-- ==========================================
-- CleanHome Production Database Schema - MySQL
-- Proyecto comercial real - Arquitectura escalable
-- ==========================================

-- Users table - Core authentication and profile data
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed password',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    role ENUM('CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(512),
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Service providers table - Professional service provider profiles
CREATE TABLE service_providers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    business_name VARCHAR(255),
    description TEXT,
    years_experience INT UNSIGNED,
    hourly_rate DECIMAL(10, 2),
    service_radius DECIMAL(5, 2) COMMENT 'Service radius in kilometers',
    is_available BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Verified by admin/background check',
    rating_average DECIMAL(3, 2) DEFAULT 0.0,
    total_ratings INT UNSIGNED DEFAULT 0,
    total_bookings INT UNSIGNED DEFAULT 0,
    license_number VARCHAR(100),
    insurance_number VARCHAR(100),
    bank_account_number VARCHAR(100) COMMENT 'Encrypted sensitive data',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_available (is_available),
    INDEX idx_is_verified (is_verified),
    INDEX idx_rating (rating_average DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services table - Service offerings catalog
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_provider_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    service_type ENUM('BASIC_CLEANING', 'DEEP_CLEANING', 'MOVE_IN_OUT_CLEANING', 'POST_CONSTRUCTION_CLEANING', 'OFFICE_CLEANING', 'WINDOW_CLEANING', 'CARPET_CLEANING') NOT NULL,
    base_price DECIMAL(10, 2),
    estimated_duration_hours INT UNSIGNED,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_provider FOREIGN KEY (service_provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    INDEX idx_provider_id (service_provider_id),
    INDEX idx_service_type (service_type),
    INDEX idx_is_active (is_active),
    INDEX idx_base_price (base_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table - Core transactional data
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    service_provider_id BIGINT,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NULL,
    status ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    service_address VARCHAR(255) NOT NULL,
    service_city VARCHAR(100) NOT NULL,
    service_state VARCHAR(100) NOT NULL,
    service_postal_code VARCHAR(20) NOT NULL,
    service_latitude DECIMAL(10, 8),
    service_longitude DECIMAL(11, 8),
    total_amount DECIMAL(10, 2),
    estimated_duration_hours INT UNSIGNED,
    actual_duration_hours INT UNSIGNED,
    customer_notes TEXT,
    provider_notes TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_service FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT fk_booking_provider FOREIGN KEY (service_provider_id) REFERENCES service_providers(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_service_id (service_id),
    INDEX idx_provider_id (service_provider_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date_time DESC),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_customer_status (customer_id, status),
    INDEX idx_provider_status (service_provider_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments table - Financial transactions with Wompi integration
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'COP',
    payment_method VARCHAR(50) COMMENT 'CREDIT_CARD, DEBIT_CARD, PSE, NEQUI, etc.',
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(255) COMMENT 'Internal transaction ID',
    external_payment_id VARCHAR(255) COMMENT 'Wompi transaction ID',
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(10, 2),
    refund_date TIMESTAMP NULL,
    failure_reason VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_external_id (external_payment_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ratings table - Service quality feedback system
CREATE TABLE ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    service_provider_id BIGINT NOT NULL,
    booking_id BIGINT NOT NULL,
    rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_provider FOREIGN KEY (service_provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_provider_id (service_provider_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_rating (rating DESC),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Provider services junction table - Many-to-many relationship
CREATE TABLE provider_services (
    provider_id BIGINT NOT NULL,
    service_type ENUM('BASIC_CLEANING', 'DEEP_CLEANING', 'MOVE_IN_OUT_CLEANING', 'POST_CONSTRUCTION_CLEANING', 'OFFICE_CLEANING', 'WINDOW_CLEANING', 'CARPET_CLEANING') NOT NULL,
    PRIMARY KEY (provider_id, service_type),
    CONSTRAINT fk_ps_provider FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    INDEX idx_service_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
