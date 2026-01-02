-- Migration V5: Sistema de disponibilidad de proveedores

-- Tabla de disponibilidad semanal de proveedores
CREATE TABLE provider_availability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_provider_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL COMMENT 'MONDAY, TUESDAY, etc.',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_bookings_per_day INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_day (service_provider_id, day_of_week),
    INDEX idx_provider_availability (service_provider_id, is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de fechas bloqueadas de proveedores
CREATE TABLE provider_blocked_dates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_provider_id BIGINT NOT NULL,
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    is_full_day BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_date (service_provider_id, blocked_date),
    INDEX idx_blocked_dates (service_provider_id, blocked_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
