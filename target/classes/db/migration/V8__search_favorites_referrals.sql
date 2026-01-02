-- Migration V8: Búsqueda, favoritos, referencias y lealtad

-- Tabla de favoritos
CREATE TABLE favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    service_provider_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_provider (user_id, service_provider_id),
    INDEX idx_user (user_id),
    INDEX idx_provider (service_provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de referencias
CREATE TABLE referrals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    referrer_id BIGINT NOT NULL,
    referred_id BIGINT NOT NULL,
    referral_code VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_referrer (referrer_id),
    INDEX idx_referred (referred_id),
    INDEX idx_code (referral_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de puntos de lealtad
CREATE TABLE loyalty_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    current_points INT NOT NULL DEFAULT 0,
    total_earned INT NOT NULL DEFAULT 0,
    total_spent INT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_points (current_points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar índices para búsqueda optimizada
ALTER TABLE service_providers ADD FULLTEXT INDEX idx_search (business_name, description);
ALTER TABLE users ADD INDEX idx_name (first_name, last_name);

-- Agregar columna de referido en users
ALTER TABLE users ADD COLUMN referred_by_id BIGINT AFTER expo_push_token;
ALTER TABLE users ADD FOREIGN KEY (referred_by_id) REFERENCES users(id) ON DELETE SET NULL;
