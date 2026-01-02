-- Migration V7: Sistema de transacciones, cupones y analytics

-- Tabla de transacciones
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    description VARCHAR(500),
    metadata TEXT,
    error_message VARCHAR(1000),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    INDEX idx_payment (payment_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cupones
CREATE TABLE coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200) NOT NULL,
    discount_amount DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    min_purchase_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    max_usages INT NOT NULL,
    current_usages INT DEFAULT 0,
    max_usages_per_user INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_first_time_only BOOLEAN DEFAULT FALSE,
    applicable_service_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (applicable_service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_active (is_active),
    INDEX idx_valid_dates (valid_from, valid_until),
    CONSTRAINT chk_discount CHECK (
        (discount_amount IS NOT NULL AND discount_percentage IS NULL) OR
        (discount_amount IS NULL AND discount_percentage IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de usos de cupones
CREATE TABLE coupon_usages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_coupon (coupon_id),
    INDEX idx_user (user_id),
    INDEX idx_booking (booking_id),
    INDEX idx_used_at (used_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columna de cupón aplicado a bookings
ALTER TABLE bookings ADD COLUMN applied_coupon_id BIGINT AFTER total_price;
ALTER TABLE bookings ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0.00 AFTER applied_coupon_id;
ALTER TABLE bookings ADD FOREIGN KEY (applied_coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- Insertar cupones de ejemplo
INSERT INTO coupons (code, description, discount_percentage, min_purchase_amount, valid_from, valid_until, max_usages, is_first_time_only)
VALUES 
('BIENVENIDA20', 'Descuento de bienvenida 20% OFF', 20.00, 50000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 1000, TRUE),
('LIMPIEZA10', '10% de descuento en cualquier servicio', 10.00, 30000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 500, FALSE),
('VERANO2025', 'Promoción de verano - 15% OFF', 15.00, 40000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 MONTH), 200, FALSE);
